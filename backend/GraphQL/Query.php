<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use App\GraphQL\Types\ProductType;
use App\GraphQL\Types\CategoryType;
use App\GraphQL\Resolvers\ProductsResolver;
use App\GraphQL\Resolvers\CategoriesResolver;

class Query
{
    public static function defineQueries(): ObjectType
    {
        return new ObjectType([
            'name' => 'Query',
            'fields' => [
                'echo' => [
                    'type' => Type::string(),
                    'args' => [
                        'message' => ['type' => Type::string()],
                    ],
                    'resolve' => static fn ($rootValue, array $args): string => $rootValue['prefix'] . $args['message'],
                ],
                'categories' => [
                    'type' => Type::listOf(CategoryType::getInstance()),
                    'resolve' => static fn () => CategoriesResolver::index(),
                ],
                'products' => [
                    'type' => Type::listOf(ProductType::getInstance()),
                    'args' => [
                        'category' => ['type' => Type::string()],
                    ],
                    'resolve' => static fn ($rootValue, array $args) => ProductsResolver::index($args['category'] ?? null),
                ],
                'product' => [
                    'type' => ProductType::getInstance(),
                    'args' => [
                        'id' => ['type' => Type::nonNull(Type::string())],
                    ],
                    'resolve' => static fn ($rootValue, array $args) => ProductsResolver::show($args['id']),
                ],
            ],
        ]);
    }
}