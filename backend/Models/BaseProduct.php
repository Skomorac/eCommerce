<?php

namespace App\Models;

abstract class BaseProduct extends Model
{
    abstract public function getType(): string;

    // public function findAll()
    // {
    //     $query = "SELECT * FROM products WHERE type = :type";
    //     $stmt = $this->conn->prepare($query);
    //     $type = $this->getType();
    //     $stmt->bindParam(':type', $type);
    //     $stmt->execute();
    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function findAll()
    {
        try {
            error_log("Entering BaseProduct::findAll()");
            $query = "SELECT * FROM products";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            error_log("BaseProduct::findAll() result count: " . count($results));
            return $results;
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
        $query = "SELECT * FROM products WHERE id = :id AND type = :type";
        $stmt = $this->conn->prepare($query);
        $type = $this->getType();
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':type', $type);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
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