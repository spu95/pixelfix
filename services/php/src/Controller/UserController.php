<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class UserController extends AbstractController
{
    #[Route('/api/user', name: 'app_api_user_index', methods: ['GET'])]
    public function index(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json($user);
    }

    #[Route('/api/user', name: 'app_api_user_update', methods: ['PUT'])]
    public function update(#[CurrentUser] User $user): JsonResponse
    {
        // Here you would handle the update logic, e.g., updating user details
        // For now, we just return the user as a placeholder
        return $this->json($user);
    }
}
