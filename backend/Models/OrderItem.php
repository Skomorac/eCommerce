<?php

namespace App\Models;

use PDO;

class OrderItem extends Model
{
    protected static $table = 'order_items';

    public static function insertItem(int $orderId, array $productDetails): array
    {
        $db = self::getDB();
        $query = 'INSERT INTO ' . static::getTable() . ' 
                  (order_id, product_id, product_name, attribute_values, quantity, paid_amount, paid_currency) 
                  VALUES (:orderId, :productId, :productName, :attributeValues, :quantity, :paidAmount, :paidCurrency)';
        
        $stmt = $db->prepare($query);
        $result = $stmt->execute([
            ':orderId' => $orderId,
            ':productId' => $productDetails['productId'],
            ':productName' => $productDetails['productName'],
            ':attributeValues' => $productDetails['attributeValues'],
            ':quantity' => $productDetails['quantity'],
            ':paidAmount' => $productDetails['paidAmount'],
            ':paidCurrency' => $productDetails['paidCurrency'],
        ]);

        if (!$result) {
            return [
                'success' => false,
                'error' => 'Failed to insert order item.'
            ];
        }

        return [
            'success' => true,
            'itemId' => $db->lastInsertId()
        ];
    }
}