<?php

namespace App\Models;

class ColorAttribute extends BaseAttribute
{
    public function getType(): string
    {
        return 'color';
    }

    public function getHexValue($attributeId)
    {
        try {
            $query = "SELECT value FROM attributes WHERE id = :id AND type = 'color'";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $attributeId);
            $stmt->execute();
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            return $result ? $result['value'] : null;
        } catch (\PDOException $e) {
            // Log the error
            error_log('Error in getHexValue: ' . $e->getMessage());
            return null;
        }
    }
}