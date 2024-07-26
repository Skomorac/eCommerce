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

            $schema = new Schema([
                'query' => $queryType,
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
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    }
}
