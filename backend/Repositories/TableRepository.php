<?php

namespace App\Repositories;

class TableRepository implements RepositoryInterface
{
    protected $conn;

    public function __construct(\PDO $conn)
    {
        $this->conn = $conn;
    }

    public function findAll()
    {
        $query = "SHOW TABLES";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $tables = $stmt->fetchAll(\PDO::FETCH_COLUMN);
        return array_map(function($table) {
            return ['name' => $table];
        }, $tables);
    }

    public function findOne($name)
    {
        $query = "SHOW TABLES LIKE :name";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_COLUMN);
        return $result ? ['name' => $result] : null;
    }

    public function create($data)
    {
        // Creating tables dynamically is generally not recommended
        // and could be a security risk. Implement with caution.
        throw new \Exception("Creating tables dynamically is not supported.");
    }

    public function update($id, $data)
    {
        // Updating table structures dynamically is not typically done this way
        throw new \Exception("Updating tables dynamically is not supported.");
    }

    public function delete($name)
    {
        // Deleting tables dynamically is generally not recommended
        // and could be a security risk. Implement with caution.
        throw new \Exception("Deleting tables dynamically is not supported.");
    }

    public function getConnection()
    {
        return $this->conn;
    }
}