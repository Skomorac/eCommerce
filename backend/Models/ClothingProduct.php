<?php

namespace App\Models;

class ClothingProduct extends Product {
    public function getType() {
        return 'clothing';
    }

    // Add any clothing-specific methods here
}