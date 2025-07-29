<?php

namespace App\Model;

class UpdateUser
{
    public function __construct(
        public readonly string $firstName,
        public readonly string $lastName,
        public readonly string $email,
        public readonly string $phoneNumber,
        public readonly ?string $companyName,
        public readonly string $street,
        public readonly string $houseNumber,
        public readonly string $city,
        public readonly int $zip,
    ) {}
}