<?php

namespace App\Models;

class Category extends Model {
    protected $primaryKey = 'name';
    public $incrementing = false;
    protected $keyType = 'string';

    public function findAll() {
        $query = "SELECT name FROM categories";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function create($name) {
        $query = "INSERT INTO categories (name) VALUES (:name)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        
        if ($stmt->execute()) {
            return ['name' => $name];
        } else {
            throw new \Exception("Failed to create category");
        }
    }
}