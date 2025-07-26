<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class ApiController extends AbstractController
{
    #[Route('/api/test', name: 'test')]
    public function index(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller ' . $user->getEmail(),
        ]);
    }
}
