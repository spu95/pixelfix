<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use App\Model\UpdateUser;
use App\Service\UserUpdateService;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\HttpFoundation\Response;

final class UserController extends AbstractController
{
    public function __construct(
        private readonly UserUpdateService $userUpdateService
    ) {}

    #[Route('/api/user', name: 'app_api_user_index', methods: ['GET'])]
    public function index(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json($user, context: ['groups' => 'user_profile']);
    }

    #[Route('/api/user', name: 'app_api_user_update', methods: ['PUT'])]
    public function update(#[CurrentUser] User $user, #[MapRequestPayload] UpdateUser $updateUser): JsonResponse
    {
        try {
            $updatedUser = $this->userUpdateService->updateUser($updateUser, $user);

            return $this->json(
                $updatedUser,
                Response::HTTP_OK,
                context: ['groups' => 'user_profile']
            );
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'error' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to update user profile',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
