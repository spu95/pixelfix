<?php

namespace App\Service;

use App\Entity\Image;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Psr\Log\LoggerInterface;

use Symfony\Component\Filesystem\Filesystem;

class ImageUploadService
{
    public function __construct(
        #[Autowire('%app.storage_images_dir%')]
        private readonly string $targetDirectory,
        private readonly SluggerInterface $slugger,
        private readonly LoggerInterface $logger,
        private readonly Filesystem $filesystem,
        private readonly EntityManagerInterface $entityManager,
    ) {}

    public function processUpload(User $user, UploadedFile $file): Image
    {
        $this->filesystem->mkdir($this->targetDirectory);

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $clientOriginalName = $file->getClientOriginalName();
        $fileSize = $file->getSize();
        $mimeType = $file->getClientMimeType();

        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        try {
            $file->move($this->targetDirectory, $newFilename);

            $this->logger->info('Image uploaded successfully', [
                'filename' => $newFilename,
                'original_name' => $clientOriginalName,
                'size' => $fileSize
            ]);

            $image = new Image();
            $image->setFileName($newFilename);
            $image->setCreatedAt(new \DateTimeImmutable());
            $image->setUploader($user);

            $this->entityManager->persist($image);
            $this->entityManager->flush();

            return $image;

            // return [
            //     'filename' => $newFilename,
            //     'original_name' => $clientOriginalName,
            //     'size' => $fileSize,
            //     'mime_type' => $mimeType,
            //     'path' => '/uploads/images/' . $newFilename
            // ];
        } catch (FileException $e) {
            $this->logger->error('Failed to upload image', [
                'error' => $e->getMessage(),
                'filename' => $clientOriginalName
            ]);

            throw new \RuntimeException('Failed to upload file: ' . $e->getMessage());
        }
    }
}
