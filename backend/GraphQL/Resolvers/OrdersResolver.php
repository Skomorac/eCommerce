<?php

namespace App\GraphQL\Resolvers;

use App\Models\Order;
use App\Config\Database;
use App\Models\OrderItem;
use Exception;

class OrdersResolver
{
    public static function store(array $args): string
    {
        error_log('Starting order placement with args: ' . json_encode($args));
        $db = new Database();
        $db->beginTransaction();

        try {
            if (empty($args['items'])) {
                throw new Exception('Items are required');
            }

            $totalAmount = 0;
            $currency = null;

            // Calculate total amount and prepare order items
            $orderItems = [];
            foreach ($args['items'] as $index => $item) {
                error_log('Processing item ' . ($index + 1) . ': ' . json_encode($item));
                self::validateItemAttributes($db, $item);

                $productDetails = self::calculatePaidAmount($db, $item);
                $totalAmount += $productDetails['paidAmount'];
                $currency = $productDetails['paidCurrency'];

                $orderItems[] = $productDetails;
            }

            // Create order
            error_log('Creating order');
            $orderResult = Order::create($db, $totalAmount, $currency);
            if (!$orderResult['success']) {
                throw new Exception($orderResult['error']);
            }
            $orderId = $orderResult['orderId'];
            error_log('Order created with ID: ' . $orderId);

            // Insert order items
            foreach ($orderItems as $item) {
                error_log('Inserting order item');
                $insertItemResult = OrderItem::insertItem($db, $orderId, $item);
                if (!$insertItemResult['success']) {
                    throw new Exception($insertItemResult['error']);
                }
            }

            $db->commit();
            error_log('Order placement completed successfully');

            return "Order placed successfully! Order ID: $orderId";
        } catch (Exception $e) {
            $db->rollback();
            error_log('Error in OrdersResolver::store: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            error_log('Args: ' . json_encode($args));
            throw $e;
        }
    }

    private static function validateItemAttributes(Database $db, array $item): void
    {
        $productId = $item['productId'];

        if (!isset($productId)) {
            throw new Exception('Product ID is required');
        }

        $product = $db->query('SELECT inStock, name FROM products WHERE id = ?', [$productId])->fetch();

        if (!$product) {
            throw new Exception('Product not found');
        }

        if (!$product['inStock']) {
            throw new Exception("Unfortunately, '{$product['name']}' is out of stock. Please check back later.");
        }

        $attributeCount = $db->query(
            'SELECT COUNT(DISTINCT attribute_id) FROM product_attributes WHERE product_id = ?',
            [$productId]
        )->fetchColumn();

        if (!isset($item['attributeValues']) || $attributeCount !== count($item['attributeValues'])) {
            throw new Exception('Attribute values are required');
        }

        foreach ($item['attributeValues'] as $attribute) {
            $result = $db->query(
                'SELECT COUNT(*) FROM product_attributes WHERE product_id = ? AND attribute_id = ? AND value = ? LIMIT 1',
                [$productId, $attribute['id'], $attribute['value']]
            );

            if ($result->fetchColumn() == 0) {
                throw new Exception("Oops! '{$product['name']}' with '{$attribute['value']}' attribute does not exist or is invalid. Please check and try again.");
            }
        }
    }

    private static function calculatePaidAmount(Database $db, array $item): array
    {
        $productId = $item['productId'];
        $quantity = $item['quantity'] ?? 1;

        $productQuery = $db->query('SELECT name FROM products WHERE id = ?', [$productId]);
        $product = $productQuery->fetch();

        if (!$product) {
            throw new Exception('Product not found');
        }

        $priceQuery = $db->query('SELECT amount, currency FROM prices WHERE product_id = ?', [$productId]);
        $price = $priceQuery->fetch();

        if (!$price) {
            throw new Exception('Price not found for product');
        }

        $paidAmount = $price['amount'] * $quantity;
        $paidCurrency = $price['currency'];

        $formattedAttributeValues = [];
        foreach ($item['attributeValues'] as $attribute) {
            $formattedAttributeValues[strtolower($attribute['id'])] = $attribute['value'];
        }
        $attributeValuesJson = json_encode($formattedAttributeValues);

        return [
            'productId' => $productId,
            'productName' => $product['name'],
            'attributeValues' => $attributeValuesJson,
            'quantity' => $quantity,
            'paidAmount' => $paidAmount,
            'paidCurrency' => $paidCurrency,
        ];
    }
}