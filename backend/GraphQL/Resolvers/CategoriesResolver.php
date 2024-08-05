<?php

namespace App\GraphQL\Resolvers;

use App\Models\Category;
use Exception;

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

    public static function addCategory(string $name): string
    {
        try {
            $category = new Category();
            $category->name = $name;
            $category->save();
            return "Category added successfully";
        } catch (Exception $e) {
            error_log('Error in CategoriesResolver::addCategory: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }
}
