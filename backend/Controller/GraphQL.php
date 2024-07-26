<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use App\Resolvers\CategoryResolver;
use App\Repositories\CategoryRepository;
use App\Models\Category;
use RuntimeException;
use Throwable;

class GraphQL {
    static public function handle() {
        try {
            $categoryModel = new Category();
            $categoryRepository = new CategoryRepository($categoryModel);
            $categoryResolver = new CategoryResolver($categoryRepository);

            $categoryType = new ObjectType([
                'name' => 'Category',
                'fields' => [
                    'name' => ['type' => Type::string()],
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
                        'path' => ['createCategory'],
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