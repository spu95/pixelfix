<?php

namespace App\Controller;

use App\Service\ImageUploadService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Entity\User;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[AsController]
class ImageController extends AbstractController
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService,
        private readonly ValidatorInterface $validator
    ) {}

    #[Route('/api/upload/image', name: 'app_api_upload_image', methods: ['POST'])]
    public function upload(#[CurrentUser] User $user, Request $request): JsonResponse
    {
        /** @var UploadedFile|null $uploadedFile */
        $uploadedFile = $request->files->get('image');

        if (!$uploadedFile) {
            return $this->json([
                'error' => 'No image file provided'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validierung mit Symfony Constraints
        $violations = $this->validator->validate(
            $uploadedFile,
            [
                new Assert\NotBlank(message: 'Please upload an image file'),
                new Assert\File(
                    maxSize: '5M',
                    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
                    maxSizeMessage: 'The image size should not exceed {{ limit }}',
                    mimeTypesMessage: 'Please upload a valid image (JPEG, PNG or WebP)'
                )
            ]
        );

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[] = $violation->getMessage();
            }

            return $this->json([
                'errors' => $errors
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            // Delegiere die eigentliche Upload-Logik an den Service
            $result = $this->imageUploadService->processUpload($user, $uploadedFile);

            return $this->json([
                'success' => true,
                'data' => $result
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to upload image',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
