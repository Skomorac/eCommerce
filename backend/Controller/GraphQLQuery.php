<?php

namespace App\Controller;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class GraphQLQuery
{
    public static function getQueryType($categoryResolver, $productResolver, $attributeResolver, $tableResolver)
    {
        return new ObjectType([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => Type::listOf(GraphQLTypes::getCategoryType()),
                    'resolve' => function() use ($categoryResolver) {
                        return $categoryResolver->resolveCategories();
                    },
                ],
                'category' => [
                    'type' => GraphQLTypes::getCategoryType(),
                    'args' => [
                        'name' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function($rootValue, $args) use ($categoryResolver) {
                        return $categoryResolver->resolveCategory($rootValue, $args);
                    },
                ],
                'products' => [
                    'type' => Type::listOf(GraphQLTypes::getProductType($attributeResolver)),
                    'resolve' => function() use ($productResolver) {
                        return $productResolver->resolveProducts();
                    },
                ],
                'product' => [
                    'type' => GraphQLTypes::getProductType($attributeResolver),
                    'args' => [
                        'id' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function($rootValue, $args) use ($productResolver) {
                        return $productResolver->resolveProduct($rootValue, $args);
                    },
                ],
                'tables' => [
                    'type' => Type::listOf(GraphQLTypes::getTableType()),
                    'resolve' => function() use ($tableResolver) {
                        return $tableResolver->resolveTables();
                    },
                ],
            ]
        ]);
    }
}