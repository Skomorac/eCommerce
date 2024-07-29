<?php

namespace App\Models;

use PDO;

class Product extends Model
{
    protected static $table = 'products';

    public static function all(?string $category = null): array
    {
        $query = 'SELECT * FROM ' . static::getTable();
        $params = [];

        if ($category && strtolower($category) !== 'all') {
            $query .= ' WHERE category = :category';
            $params['category'] = $category;
        }

        $stmt = self::getDB()->prepare($query);
        $stmt->execute($params);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($products as &$product) {
            self::fetchProductDetails($product);
        }

        return $products;
    }

    public static function find(string $value, ?string $column = 'id'): ?array
    {
        $product = parent::find($value, $column);

        if ($product) {
            self::fetchProductDetails($product);
        }

        return $product;
    }

    private static function fetchProductDetails(&$product)
    {
        $gallery = json_decode($product['gallery'], true);
        $product['gallery'] = $gallery !== null && is_array($gallery) ? $gallery : [];

        $product['prices'] = Price::getByProductId($product['id']);
        $product['attributes'] = Attribute::getByProductId($product['id']);
    }
}