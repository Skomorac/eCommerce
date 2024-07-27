<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Schema;
use GraphQL\Error\FormattedError;
use RuntimeException;
use Throwable;

class GraphQL {
    static public function handle() {
        try {
            $categoryModel = new \App\Models\Category();
            $categoryRepository = new \App\Repositories\CategoryRepository($categoryModel);
            $categoryResolver = new \App\Resolvers\CategoryResolver($categoryRepository);

            $productModel = new \App\Models\ClothingProduct();
            $productRepository = new \App\Repositories\ProductRepository($productModel);
            $productResolver = new \App\Resolvers\ProductResolver($productRepository);

            $attributeModel = new \App\Models\TextAttribute();
            $attributeRepository = new \App\Repositories\AttributeRepository($attributeModel);
            $attributeResolver = new \App\Resolvers\AttributeResolver($attributeRepository);

            $pdo = $categoryModel->getConnection();
            $tableRepository = new \App\Repositories\TableRepository($pdo);
            $tableResolver = new \App\Resolvers\TableResolver($tableRepository);

            GraphQLTypes::init($attributeResolver);

            $queryType = GraphQLQuery::getQueryType($categoryResolver, $productResolver, $attributeResolver, $tableResolver);
            $mutationType = GraphQLMutation::getMutationType($categoryResolver, $productResolver, $attributeResolver, $tableResolver);

            $schema = new Schema([
                'query' => $queryType,
                'mutation' => $mutationType,
                'types' => GraphQLTypes::getTypes(),
            ]);

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'] ?? null;
            $variableValues = $input['variables'] ?? null;

            if ($query === null) {
                throw new RuntimeException('No GraphQL query provided');
            }

            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();

            //debugging
            $debug = true; // Set to false in production
            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray($debug);

        } catch (Throwable $e) {
            $output = [
                'errors' => [
                    [
                        'message' => 'An unexpected error occurred',
                        'locations' => [
                            [
                                'line' => $e->getLine(),
                                'column' => 0
                            ]
                        ],
                        'path' => ['error'],
                        'extensions' => [
                            'file' => $e->getFile(),
                            'line' => $e->getLine(),
                            'trace' => $debug ? $e->getTraceAsString() : null,
                            'debugMessage' => $debug ? $e->getMessage() : null
                        ]
                    ]
                ],
                'data' => null
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    }
}