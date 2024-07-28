<?php

namespace App\Models;

class ElectronicsProduct extends BaseProduct
{
    public function getType(): string
    {
        return 'tech';  // Changed from 'electronics' to match the category in the database
    }

    public function getAttributes($productId)
    {
        // Retrieve all attributes for the product
        $query = "SELECT a.name, a.type, pa.displayValue, pa.value
                  FROM product_attributes pa
                  JOIN attributes a ON pa.attribute_id = a.id
                  WHERE pa.product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':product_id', $productId);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Override findOne to include all attributes
    public function findOne($id)
    {
        $product = parent::findOne($id);
        if ($product) {
            $product['attributes'] = $this->getAttributes($id);
        }
        return $product;
    }

    // Override findAll to include attributes for each product
    public function findAll()
    {
        $products = parent::findAll();
        foreach ($products as &$product) {
            $product['attributes'] = $this->getAttributes($product['id']);
        }
        return $products;
    }
}