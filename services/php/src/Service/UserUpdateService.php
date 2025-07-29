<?php

namespace App\Service;

use App\Entity\User;
use App\Model\UpdateUser;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserUpdateService
{
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator,
    ) {}

    public function updateUser(UpdateUser $updateUser, User $user): User
    {
        // Check if email is already taken by another user
        $existingUser = $this->userRepository->findOneBy(['email' => $updateUser->email]);
        if ($existingUser && $existingUser->getId() !== $user->getId()) {
            throw new \InvalidArgumentException('Email address is already in use by another user');
        }

        // Update user properties
        $user->setFirstName($updateUser->firstName);
        $user->setLastName($updateUser->lastName);
        $user->setEmail($updateUser->email);
        $user->setPhoneNumber($updateUser->phoneNumber);
        $user->setCompanyName($updateUser->companyName);
        $user->setStreet($updateUser->street);
        $user->setHouseNumber($updateUser->houseNumber);
        $user->setCity($updateUser->city);
        $user->setZip($updateUser->zip);
        $user->setUpdatedAt(new \DateTimeImmutable());

        // Validate the updated user
        $violations = $this->validator->validate($user);
        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[] = $violation->getMessage();
            }
            throw new \InvalidArgumentException('User validation failed: ' . implode(', ', $errors));
        }

        $this->entityManager->flush();

        $this->logger->info('User updated successfully', [
            'user_id' => $user->getId(),
            'email' => $user->getEmail()
        ]);

        return $user;
    }
}