<?php

namespace App\Models;

use PDO;

class Order extends Model
{
    protected static $table = 'orders';

    public static function create(float $totalAmount, string $currency): array
    {
        $db = self::getDB();
        $query = 'INSERT INTO ' . static::getTable() . ' (total_amount, total_currency) VALUES (:amount, :currency)';
        $stmt = $db->prepare($query);
        $result = $stmt->execute([
            ':amount' => $totalAmount,
            ':currency' => $currency
        ]);

        if (!$result) {
            return [
                'success' => false,
                'error' => 'Failed to create order'
            ];
        }

        return [
            'success' => true,
            'orderId' => $db->lastInsertId()
        ];
    }

    public static function update(int $orderId, float $totalAmount, string $currency): array
    {
        $db = self::getDB();
        $query = 'UPDATE ' . static::getTable() . ' SET total_amount = :amount, total_currency = :currency WHERE id = :id';
        $stmt = $db->prepare($query);
        $result = $stmt->execute([
            ':amount' => $totalAmount,
            ':currency' => $currency,
            ':id' => $orderId
        ]);

        if (!$result) {
            return [
                'success' => false,
                'error' => 'Failed to update order'
            ];
        }

        return [
            'success' => true
        ];
    }
}
