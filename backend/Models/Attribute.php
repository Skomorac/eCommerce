<?php

namespace App\Models;

abstract class Attribute extends Model {
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    abstract public function getType();

    public function findAll() {
        $query = "SELECT * FROM attributes";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function findOne($id) {
        $query = "SELECT * FROM attributes WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function create(array $data) {
        $query = "INSERT INTO attributes (id, name, type) VALUES (:id, :name, :type)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':type', $data['type']);

        if ($stmt->execute()) {
            return $this->findOne($data['id']);
        } else {
            throw new \Exception("Failed to create attribute");
        }
    }

    // Implement update and delete methods as needed
}