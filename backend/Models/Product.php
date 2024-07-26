<?php

namespace App\Models;

abstract class Product extends Model {
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    abstract public function getType();

    public function findAll() {
        $query = "SELECT * FROM products";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        foreach ($results as &$result) {
            $result['gallery'] = json_decode($result['gallery'], true);
        }
        
        return $results;
    }

    public function findOne($id) {
        $query = "SELECT * FROM products WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if ($result) {
            $result['gallery'] = json_decode($result['gallery'], true);
        }
        
        return $result;
    }

    public function create(array $data) {
        $query = "INSERT INTO products (id, name, inStock, gallery, description, category, brand) 
                  VALUES (:id, :name, :inStock, :gallery, :description, :category, :brand)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':name', $data['name']);
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

    // Implement update and delete methods as needed
}