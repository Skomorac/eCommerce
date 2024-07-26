<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Repositories\CategoryRepository;
use App\Models\Category;
use App\Resolvers\CategoryResolver;
use App\Resolvers\Resolver;

// Debugging class existence
var_dump(class_exists('App\Models\Category'));
var_dump(class_exists('App\Repositories\RepositoryInterface'));
var_dump(class_exists('App\Repositories\CategoryRepository'));
var_dump(class_exists('App\Resolvers\CategoryResolver'));
var_dump(class_exists('App\Resolvers\Resolver'));

// Attempt to instantiate a class to verify autoload
try {
    $category = new Category();
    $categoryRepo = new CategoryRepository($category);
    echo "Class CategoryRepository loaded successfully.\n";
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
