<?php

namespace App\Models;

class TextAttribute extends Attribute {
    public function getType() {
        return 'text';
    }

    // Add any text attribute-specific methods here
}