<?php

namespace App\Models;

class ClothingProduct extends BaseProduct
{
    public function getType(): string
    {
        return 'clothes';  // Changed from 'clothing' to match the category in the database
    }

    public function getSizes($productId)
    {
        // Retrieve size attributes for the product
        $query = "SELECT pa.displayValue, pa.value
                  FROM product_attributes pa
                  JOIN attributes a ON pa.attribute_id = a.id
                  WHERE pa.product_id = :product_id AND a.name = 'size'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':product_id', $productId);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Override findOne to include sizes
    public function findOne($id)
    {
        $product = parent::findOne($id);
        if ($product) {
            $product['sizes'] = $this->getSizes($id);
        }
        return $product;
    }

    // Override findAll to include sizes for each product
    public function findAll()
    {
        $products = parent::findAll();
        foreach ($products as &$product) {
            $product['sizes'] = $this->getSizes($product['id']);
        }
        return $products;
    }
}