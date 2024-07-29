<?php

namespace App\Models;

use PDO;

class Attribute extends Model
{
    protected static $table = 'attributes';

    public static function getByProductId($productId): array
    {
        $query = 
            'SELECT 
                pa.*, 
                a.name as attribute_name, 
                a.type as attribute_type
            FROM 
                product_attributes pa
            JOIN 
                ' . static::getTable() . ' a
            ON 
                pa.attribute_id = a.id 
            WHERE 
                product_id = :productId';

        $stmt = self::getDB()->prepare($query);
        $stmt->execute(['productId' => $productId]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $attributes = [];
        foreach ($items as $item) {
            $attributeId = $item['attribute_id'];

            if (!isset($attributes[$attributeId])) {
                $attributes[$attributeId] = [
                    'id' => $item['id'],
                    'attribute_id' => $attributeId,
                    'name' => $item['attribute_name'],
                    'type' => $item['attribute_type'],
                    'items' => [],
                ];
            }

            $attributes[$attributeId]['items'][] = [
                'id' => $item['id'],
                'attribute_id' => $attributeId,
                'value' => $item['value'],
                'displayValue' => $item['displayValue'],
            ];
        }

        return array_values($attributes);
    }
}