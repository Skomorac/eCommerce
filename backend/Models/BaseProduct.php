<?php

namespace App\Models;

abstract class BaseProduct extends Model
{
    abstract public function getType(): string;


    public function findAll()
    {
        try {
            $query = "SELECT p.*, GROUP_CONCAT(DISTINCT pr.amount) as prices, GROUP_CONCAT(DISTINCT c.label) as currencies
                      FROM products p
                      LEFT JOIN prices pr ON p.id = pr.product_id
                      LEFT JOIN currencies c ON pr.currency = c.label
                      WHERE p.category = :category
                      GROUP BY p.id";
            $stmt = $this->conn->prepare($query);
            $category = $this->getType();
            $stmt->bindParam(':category', $category);
            $stmt->execute();
            $products = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            // Fetch attributes for each product
            foreach ($products as &$product) {
                $attributesQuery = "SELECT a.name, a.type, pa.displayValue, pa.value
                                    FROM product_attributes pa
                                    JOIN attributes a ON pa.attribute_id = a.id
                                    WHERE pa.product_id = :product_id";
                $attributesStmt = $this->conn->prepare($attributesQuery);
                $attributesStmt->bindParam(':product_id', $product['id']);
                $attributesStmt->execute();
                $product['attributes'] = $attributesStmt->fetchAll(\PDO::FETCH_ASSOC);

                // Format prices
                $priceAmounts = explode(',', $product['prices']);
                $currencies = explode(',', $product['currencies']);
                $product['prices'] = array_map(function($amount, $currency) {
                    return [
                        'amount' => floatval($amount),
                        'currency' => [
                            'label' => $currency,
                            'symbol' => $currency === 'USD' ? '$' : '€'
                        ]
                    ];
                }, $priceAmounts, $currencies);

                unset($product['currencies']); // Remove the raw currencies data
            }

            return $products;
        } catch (\PDOException $e) {
            error_log("Database error in BaseProduct::findAll(): " . $e->getMessage());
            throw $e;
        } catch (\Exception $e) {
            error_log("Unexpected error in BaseProduct::findAll(): " . $e->getMessage());
            throw $e;
        }
    }

    public function findOne($id)
    {
        $query = "SELECT p.*, GROUP_CONCAT(DISTINCT pr.amount) as prices, GROUP_CONCAT(DISTINCT c.label) as currencies
                  FROM products p
                  LEFT JOIN prices pr ON p.id = pr.product_id
                  LEFT JOIN currencies c ON pr.currency = c.label
                  WHERE p.id = :id AND p.category = :category
                  GROUP BY p.id";
        $stmt = $this->conn->prepare($query);
        $category = $this->getType();
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':category', $category);
        $stmt->execute();
        $product = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($product) {
            // Fetch attributes
            $attributesQuery = "SELECT a.name, a.type, pa.displayValue, pa.value
                                FROM product_attributes pa
                                JOIN attributes a ON pa.attribute_id = a.id
                                WHERE pa.product_id = :product_id";
            $attributesStmt = $this->conn->prepare($attributesQuery);
            $attributesStmt->bindParam(':product_id', $product['id']);
            $attributesStmt->execute();
            $product['attributes'] = $attributesStmt->fetchAll(\PDO::FETCH_ASSOC);

            // Format prices
            $priceAmounts = explode(',', $product['prices']);
            $currencies = explode(',', $product['currencies']);
            $product['prices'] = array_map(function($amount, $currency) {
                return [
                    'amount' => floatval($amount),
                    'currency' => [
                        'label' => $currency,
                        'symbol' => $currency === 'USD' ? '$' : '€'
                    ]
                ];
            }, $priceAmounts, $currencies);

            unset($product['currencies']); // Remove the raw currencies data
        }

        return $product;
    }

    public function create(array $data)
    {
        $query = "INSERT INTO products (id, name, type, inStock, gallery, description, category, brand) 
                  VALUES (:id, :name, :type, :inStock, :gallery, :description, :category, :brand)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':type', $this->getType());
        $stmt->bindParam(':inStock', $data['inStock'], \PDO::PARAM_BOOL);
        $stmt->bindParam(':gallery', json_encode($data['gallery']));
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':category', $data['category']);
        $stmt->bindParam(':brand', $data['brand']);

        if ($stmt->execute()) {
            return $this->findOne($data['id']);
        } else {
            throw new \Exception("Failed to create product");
        }
    }

    public function update($id, array $data)
    {
        $query = "UPDATE products SET name = :name, inStock = :inStock, gallery = :gallery, 
                  description = :description, category = :category, brand = :brand 
                  WHERE id = :id AND type = :type";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':type', $this->getType());
        $stmt->bindParam(':inStock', $data['inStock'], \PDO::PARAM_BOOL);
        $stmt->bindParam(':gallery', json_encode($data['gallery']));
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':category', $data['category']);
        $stmt->bindParam(':brand', $data['brand']);

        if ($stmt->execute()) {
            return $this->findOne($id);
        } else {
            throw new \Exception("Failed to update product");
        }
    }

    public function delete($id)
    {
        $query = "DELETE FROM products WHERE id = :id AND type = :type";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':type', $this->getType());

        return $stmt->execute();
    }
}