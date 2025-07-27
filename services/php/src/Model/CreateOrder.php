<?php

namespace App\Model;

use App\Enumeration\ProcessingOptions;

class CreateOrder
{
    public function __construct(
        /** @var string[] $processingOptions */
        public readonly array $processingOptions,
        /** @var int[] $imageIds */
        public readonly array $imageIds,
    ) {}
}
