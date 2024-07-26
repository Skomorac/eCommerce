<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use App\Resolvers\CategoryResolver;
use App\Resolvers\ProductResolver;
use App\Resolvers\AttributeResolver;
use App\Repositories\CategoryRepository;
use App\Repositories\ProductRepository;
use App\Repositories\AttributeRepository;
use App\Models\Category;
use App\Models\Product;
use App\Models\Attribute;
use RuntimeException;
use Throwable;

class GraphQL {
    static public function handle() {
        try {
            $categoryModel = new Category();
            $categoryRepository = new CategoryRepository($categoryModel);
            $categoryResolver = new CategoryResolver($categoryRepository);

            $productModel = new \App\Models\ClothingProduct();
            $productRepository = new ProductRepository($productModel);
            $productResolver = new ProductResolver($productRepository);

            $attributeModel = new \App\Models\TextAttribute();
            $attributeRepository = new AttributeRepository($attributeModel);
            $attributeResolver = new AttributeResolver($attributeRepository);

            $categoryType = new ObjectType([
                'name' => 'Category',
                'fields' => [
                    'name' => ['type' => Type::string()],
                ],
            ]);

            $attributeType = new ObjectType([
                'name' => 'Attribute',
                'fields' => [
                    'id' => ['type' => Type::string()],
                    'name' => ['type' => Type::string()],
                    'type' => ['type' => Type::string()],
                ],
            ]);

            $productType = new ObjectType([
                'name' => 'Product',
                'fields' => [
                    'id' => ['type' => Type::string()],
                    'name' => ['type' => Type::string()],
                    'inStock' => ['type' => Type::boolean()],
                    'gallery' => ['type' => Type::listOf(Type::string())],
                    'description' => ['type' => Type::string()],
                    'category' => ['type' => Type::string()],
                    'brand' => ['type' => Type::string()],
                    'attributes' => [
                        'type' => Type::listOf($attributeType),
                        'resolve' => function($product) use ($attributeResolver) {
                            return $attributeResolver->resolveProductAttributes($product['id']);
                        },
                    ],
                ],
            ]);

            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'categories' => [
                        'type' => Type::listOf($categoryType),
                        'resolve' => function() use ($categoryResolver) {
                            return $categoryResolver->resolveCategories();
                        },
                    ],
                    'category' => [
                        'type' => $categoryType,
                        'args' => [
                            'name' => Type::nonNull(Type::string()),
                        ],
                        'resolve' => function($rootValue, $args) use ($categoryResolver) {
                            return $categoryResolver->resolveCategory($rootValue, $args);
                        },
                    ],
                    'products' => [
                        'type' => Type::listOf($productType),
                        'resolve' => function() use ($productResolver) {
                            return $productResolver->resolveProducts();
                        },
                    ],
                    'product' => [
                        'type' => $productType,
                        'args' => [
                            'id' => Type::nonNull(Type::string()),
                        ],
                        'resolve' => function($rootValue, $args) use ($productResolver) {
                            return $productResolver->resolveProduct($rootValue, $args);
                        },
                    ],
                ],
            ]);

            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'createCategory' => [
                        'type' => $categoryType,
                        'args' => [
                            'name' => Type::nonNull(Type::string()),
                        ],
                        'resolve' => function($rootValue, $args) use ($categoryResolver) {
                            return $categoryResolver->createCategory($rootValue, $args);
                        },
                    ],
                    'updateCategory' => [
                        'type' => $categoryType,
                        'args' => [
                            'oldName' => Type::nonNull(Type::string()),
                            'newName' => Type::nonNull(Type::string()),
                        ],
                        'resolve' => function($rootValue, $args) use ($categoryResolver) {
                            return $categoryResolver->updateCategory($rootValue, $args);
                        },
                    ],
                    'deleteCategory' => [
                        'type' => Type::boolean(),
                        'args' => [
                            'name' => Type::nonNull(Type::string()),
                        ],
                        'resolve' => function($rootValue, $args) use ($categoryResolver) {
                            return $categoryResolver->deleteCategory($rootValue, $args);
                        },
                    ],
                    // Add product and attribute mutations here
                ],
            ]);

            $schema = new Schema([
                'query' => $queryType,
                'mutation' => $mutationType,
            ]);

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();

        } catch (Throwable $e) {
            $output = [
                'errors' => [
                    [
                        'message' => 'Internal server error: ' . $e->getMessage(),
                        'locations' => [
                            [
                                'line' => $e->getLine(),
                                'column' => 0
                            ]
                        ],
                        'path' => ['error'],
                        'trace' => $e->getTraceAsString()
                    ]
                ],
                'data' => null
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    }
}