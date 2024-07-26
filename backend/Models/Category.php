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

    public function findOne($name) {
        $query = "SELECT name FROM categories WHERE name = :name";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
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

    public function update($oldName, $newName) {
        $query = "UPDATE categories SET name = :newName WHERE name = :oldName";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':newName', $newName);
        $stmt->bindParam(':oldName', $oldName);
        if ($stmt->execute()) {
            return ['name' => $newName];
        } else {
            throw new \Exception("Failed to update category");
        }
    }

    public function delete($name) {
        $query = "DELETE FROM categories WHERE name = :name";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new \Exception("Failed to delete category");
        }
    }
}