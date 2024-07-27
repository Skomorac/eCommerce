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
                    'type' => Type::listOf(GraphQLTypes::getProductInterface()),
                    'resolve' => function() use ($productResolver) {
                        return $productResolver->resolveProducts();
                    },
                ],
                'product' => [
                    'type' => GraphQLTypes::getProductInterface(),
                    'args' => ['id' => Type::nonNull(Type::string())],
                    'resolve' => function($rootValue, $args) use ($productResolver) {
                        return $productResolver->resolveProduct($rootValue, $args);
                    },
                ],
                'attributes' => [
                    'type' => Type::listOf(GraphQLTypes::getAttributeInterface()),
                    'resolve' => function() use ($attributeResolver) {
                        return $attributeResolver->resolveAttributes();
                    },
                ],
                'attribute' => [
                    'type' => GraphQLTypes::getAttributeInterface(),
                    'args' => ['id' => Type::nonNull(Type::string())],
                    'resolve' => function($rootValue, $args) use ($attributeResolver) {
                        return $attributeResolver->resolveAttribute($rootValue, $args);
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

