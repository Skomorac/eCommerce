<?php

namespace App\Models;

class ElectronicsProduct extends BaseProduct
{
    public function getType(): string
    {
        return 'electronics';
    }

    public function getWarrantyPeriod($productId)
    {
        // Implement warranty period retrieval logic
        // This is just a placeholder, adjust according to your database structure
        $query = "SELECT warranty_period FROM electronics_details WHERE product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':product_id', $productId);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ? $result['warranty_period'] : null;
    }
}