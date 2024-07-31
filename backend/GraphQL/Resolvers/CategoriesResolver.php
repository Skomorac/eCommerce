<?php

namespace App\GraphQL\Resolvers;

use App\Models\Category;
use Exception;
use Throwable;

class CategoriesResolver
{
    public static function index(): array
    {
        try {
            $categories = Category::all();
            error_log('Categories fetched successfully: ' . count($categories));
            return $categories;
        } catch (Exception $e) {
            error_log('Error in CategoriesResolver::index: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }

    // public static function index(): array
    // {
    //     echo "Debug: Inside CategoriesResolver::index()\n";
    //     try {
    //         $categories = Category::all();
    //         echo "Debug: Categories fetched: " . json_encode($categories) . "\n";
    //         return $categories;
    //     } catch (Throwable $e) {
    //         echo "Debug: Exception in CategoriesResolver::index(): " . $e->getMessage() . "\n";
    //         echo "Debug: Stack trace: " . $e->getTraceAsString() . "\n";
    //         throw $e;
    //     }
    // }
}