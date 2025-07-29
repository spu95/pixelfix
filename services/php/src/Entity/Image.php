<?php

namespace App\Entity;

use App\Repository\ImageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
class Image
{
    #[Groups(['image_list', 'image_detail'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['image_list', 'image_detail'])]
    #[ORM\Column(length: 255)]
    private ?string $fileName = null;

    #[Groups(['image_list', 'image_detail'])]
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[Groups(['image_list', 'image_detail'])]
    private string $test = 'test';

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Order $customerOrder = null;

    #[ORM\ManyToOne(inversedBy: 'uploadedImages')]
    #[ORM\JoinColumn]
    private ?User $uploader = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFileName(): ?string
    {
        return $this->fileName;
    }

    public function setFileName(string $fileName): static
    {
        $this->fileName = $fileName;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getCustomerOrder(): ?Order
    {
        return $this->customerOrder;
    }

    public function setCustomerOrder(?Order $order): static
    {
        $this->customerOrder = $order;

        return $this;
    }

    public function getUploader(): ?User
    {
        return $this->uploader;
    }

    public function setUploader(?User $uploader): static
    {
        $this->uploader = $uploader;

        return $this;
    }
}
