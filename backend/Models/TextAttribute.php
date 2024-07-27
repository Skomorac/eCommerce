<?php

namespace App\Models;

class TextAttribute extends BaseAttribute
{
    public function getType(): string
    {
        return 'text';
    }

    // Add any text-specific methods here if needed
}