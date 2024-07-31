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
}