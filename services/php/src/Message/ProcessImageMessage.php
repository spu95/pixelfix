<?php

namespace App\Message;

class ProcessImageMessage
{
    public function __construct(
        private readonly int $orderId
    ) {}

    public function getOrderId(): int
    {
        return $this->orderId;
    }
}