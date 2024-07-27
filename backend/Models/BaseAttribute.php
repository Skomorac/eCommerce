<?php

namespace App\Models;

abstract class BaseAttribute extends Model
{
    abstract public function getType(): string;

    public function findAll()
    {
        $query = "SELECT * FROM attributes WHERE type = :type";
        $stmt = $this->conn->prepare($query);
        $type = $this->getType();
        $stmt->bindParam(':type', $type);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function findOne($id)
    {
        $query = "SELECT * FROM attributes WHERE id = :id AND type = :type";
        $stmt = $this->conn->prepare($query);
        $type = $this->getType();
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':type', $type);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function create(array $data)
    {
        $query = "INSERT INTO attributes (id, name, type, value) VALUES (:id, :name, :type, :value)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':type', $this->getType());
        $stmt->bindParam(':value', $data['value']);

        if ($stmt->execute()) {
            return $this->findOne($data['id']);
        } else {
            throw new \Exception("Failed to create attribute");
        }
    }

    public function update($id, array $data)
    {
        $query = "UPDATE attributes SET name = :name, value = :value WHERE id = :id AND type = :type";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':type', $this->getType());
        $stmt->bindParam(':value', $data['value']);

        if ($stmt->execute()) {
            return $this->findOne($id);
        } else {
            throw new \Exception("Failed to update attribute");
        }
    }

    public function delete($id)
    {
        $query = "DELETE FROM attributes WHERE id = :id AND type = :type";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':type', $this->getType());

        return $stmt->execute();
    }

    public function getConnection()
    {
        return $this->conn;
    }
}