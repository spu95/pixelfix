<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Polyfill\Intl\Icu\Exception\NotImplementedException;

final class OrderController extends AbstractController
{
    #[Route('/api/order', name: 'app_api_order_detail', methods: ['GET'])]
    public function getOrderDetail(#[CurrentUser] User $user): JsonResponse
    {
        throw new NotImplementedException(
            'This method is not implemented yet. Please implement the order detail retrieval logic.'
        );
    }

    #[Route('/api/orders', name: 'app_api_order_list', methods: ['GET'])]
    public function getOrderList(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json($user->getOrders());
    }

    public function placeOrder(#[CurrentUser] User $user): JsonResponse
    {
        throw new NotImplementedException(
            'This method is not implemented yet. Please implement the order placement logic.'
        );
    }
}
