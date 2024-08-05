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
                pa.id, 
                pa.attribute_id, 
                pa.value, 
                pa.displayValue,
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

        error_log('Fetched items for product ' . $productId . ': ' . print_r($items, true));

        $attributes = array_map(function($item) {
            return [
                'id' => $item['id'],
                'attribute_id' => $item['attribute_id'],
                'value' => $item['value'],
                'displayValue' => $item['displayValue'],
                'name' => $item['attribute_name'],
                'type' => $item['attribute_type'],
            ];
        }, $items);

        error_log('Processed attributes for product ' . $productId . ': ' . print_r($attributes, true));

        return $attributes;
    }
}