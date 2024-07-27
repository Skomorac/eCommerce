<?php

namespace App\Models;

class ClothingProduct extends BaseProduct
{
    public function getType(): string
    {
        return 'clothing';
    }

    public function getSize($productId)
    {
        // Implement size retrieval logic
        // This is just a placeholder, adjust according to your database structure
        $query = "SELECT size FROM clothing_details WHERE product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':product_id', $productId);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ? $result['size'] : null;
    }
}