<?php

namespace App\Models;

class Category extends Model {
    public function findAll() {
        $query = "SELECT name FROM categories";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
