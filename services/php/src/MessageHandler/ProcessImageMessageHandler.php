<?php

namespace App\MessageHandler;

use App\Entity\Image;
use App\Entity\Order;
use App\Enumeration\OrderStatus;
use App\Message\ProcessImageMessage;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Mime\Part\Multipart\FormDataPart;


#[AsMessageHandler]
class ProcessImageMessageHandler
{
    private const PYTHON_API_URL = 'http://127.0.0.1:8002';

    private readonly HttpClientInterface $httpClient;

    public function __construct(
        private readonly OrderRepository $orderRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly LoggerInterface $logger,
        private readonly ParameterBagInterface $parameterBag,
        ?HttpClientInterface $httpClient = null
    ) {
        $this->httpClient = $httpClient ?? HttpClient::create();
    }

    public function __invoke(ProcessImageMessage $message): void
    {
        $order = $this->orderRepository->find($message->getOrderId());

        if (!$order) {
            $this->logger->error('Order not found', ['orderId' => $message->getOrderId()]);
            return;
        }

        if ($order->getStatus() !== OrderStatus::PENDING) {
            $this->logger->warning('Order is not in PENDING status', [
                'orderId' => $order->getId(),
                'status' => $order->getStatus()->value
            ]);
            return;
        }

        try {
            $order->setStatus(OrderStatus::PROCESSING);
            $this->entityManager->flush();

            $this->processImages($order);

            $order->setStatus(OrderStatus::COMPLETED);
            $order->setProcessedAt(new \DateTimeImmutable());
            $this->entityManager->flush();

            $this->logger->info('Order processing completed', ['orderId' => $order->getId()]);
        } catch (\Exception $e) {
            $order->setStatus(OrderStatus::FAILED);
            $this->entityManager->flush();

            $this->logger->error('Order processing failed', [
                'orderId' => $order->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }

    private function processImages(Order $order): void
    {
        $storageDir = $this->parameterBag->get('app.storage_images_dir');

        foreach ($order->getImages() as $image) {
            $imagePath = sprintf('%s/%s', $storageDir, $image->getFileName());

            if (!file_exists($imagePath)) {
                throw new \Exception(sprintf('Image file not found: %s', $imagePath));
            }

            $formData = new FormDataPart([
                'file' => DataPart::fromPath($imagePath, $image->getFileName())
            ]);

            $response = $this->httpClient->request('POST', self::PYTHON_API_URL . '/select-free-form', [
                'headers' => $formData->getPreparedHeaders()->toArray(),
                'body' => $formData->bodyToIterable()
            ]);

            if ($response->getStatusCode() !== 200) {
                throw new \Exception(sprintf('Python API returned status %d', $response->getStatusCode()));
            }

            $processedImageContent = $response->getContent();
            $processedFileName = sprintf(
                'processed_%s_%s.png',
                $order->getId(),
                pathinfo($image->getFileName(), PATHINFO_FILENAME)
            );
            $processedImagePath = sprintf('%s/%s', $storageDir, $processedFileName);

            file_put_contents($processedImagePath, $processedImageContent);

            $processedImage = new Image();
            $processedImage->setFileName($processedFileName);
            $processedImage->setCreatedAt(new \DateTimeImmutable());
            $processedImage->setUploader($order->getCustomer());
            $processedImage->setCustomerOrder($order);

            $this->entityManager->persist($processedImage);

            $this->logger->info('Image processed and saved', [
                'originalFile' => $image->getFileName(),
                'processedFile' => $processedFileName,
                'orderId' => $order->getId()
            ]);
        }

        $this->entityManager->flush();
    }
}
