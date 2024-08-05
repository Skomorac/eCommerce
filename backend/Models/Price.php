<?php

namespace App\Models;

use PDO;

class Price extends Model
{
    protected static $table = 'prices';

    public static function getByProductId($productId): array
    {
        $query = 
            'SELECT 
                p.amount, c.label, c.symbol 
            FROM 
                ' . static::getTable() . ' p
            JOIN
                currencies c
            ON
                p.currency = c.label
            WHERE
                p.product_id = :productId';

        $stmt = self::getDB()->prepare($query);
        $stmt->execute(['productId' => $productId]);
        $prices = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $productPrices = [];
        foreach ($prices as $price) {
            $productPrices[] = [
                'amount' => number_format($price['amount'], 2, '.', ''),
                'currency' => [
                    'label' => $price['label'],
                    'symbol' => $price['symbol'],
                ],
            ];
        }

        return $productPrices;
    }
}