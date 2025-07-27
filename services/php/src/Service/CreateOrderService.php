<?php

namespace App\Service;

use App\Entity\Image;
use App\Entity\Order;
use App\Entity\User;
use App\Enumeration\OrderStatus;
use App\Enumeration\ProcessingOptions;
use App\Model\CreateOrder;
use App\Repository\ImageRepository;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

class CreateOrderService
{
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly ImageRepository $imageRepository,
        private readonly OrderRepository $orderRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {}

    public function createOrder(CreateOrder $createOrder, User $user): Order
    {
        $images = $this->imageRepository->findBy(['id' => $createOrder->imageIds]);

        $this->validateImages($images, $user);

        $order = new Order();
        $order->setCreatedAt(new \DateTimeImmutable());
        $order->setCustomer($user);
        $order->setStatus(OrderStatus::PENDING);

        foreach ($images as $image) {
            $image->setCustomerOrder($order);

            $order->getImages()->add($image);
        }

        foreach ($createOrder->processingOptions as $option) {
            $order->addProcessingOption(ProcessingOptions::from($option));
        }

        $this->entityManager->persist($order);
        $this->entityManager->flush();

        return $order;
    }

    private function validateImages(array $images, User $user): void
    {
        foreach ($images as $image) {
            if (!$image instanceof Image) {
                throw new \InvalidArgumentException('Invalid image provided');
            }

            if ($image->getUploader()->getId() !== $user->getId()) {
                throw new \InvalidArgumentException('Image does not belong to the user');
            }
        }
    }
}
