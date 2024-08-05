<?php

namespace App\GraphQL\Resolvers;

use App\Models\Product;
use Exception;

class ProductsResolver
{
    public static function index(?string $category = null): array
    {
        try {
            $products = Product::all($category);
            // Ensure we're returning an array
            return is_array($products) ? $products : $products->toArray();
        } catch (Exception $e) {
            // Log the error
            error_log('Error in ProductsResolver::index: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            
            // You might want to throw a GraphQL specific error here
            throw new Exception('Failed to fetch products');
        }
    }

    public static function show(string $productId): ?array
    {
        try {
            $product = Product::find($productId);
            if (!$product) {
                return null;
            }
            // Ensure we're returning an array
            return is_array($product) ? $product : $product->toArray();
        } catch (Exception $e) {
            // Log the error
            error_log('Error in ProductsResolver::show: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            
            // You might want to throw a GraphQL specific error here
            throw new Exception('Failed to fetch product');
        }
    }
}