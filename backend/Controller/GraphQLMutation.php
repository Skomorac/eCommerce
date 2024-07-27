<?php

namespace App\Controller;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\GraphQL\Types;

class GraphQLMutation
{
    public static function getMutationType($categoryResolver, $productResolver, $attributeResolver)
    {
        return new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'createCategory' => [
                    'type' => GraphQLTypes::getCategoryType(),
                    'args' => [
                        'name' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function($rootValue, $args) use ($categoryResolver) {
                        return $categoryResolver->createCategory($rootValue, $args);
                    },
                ],
                'updateCategory' => [
                    'type' => GraphQLTypes::getCategoryType(),
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
                'createProduct' => [
                    'type' => GraphQLTypes::getProductInterface(),
                    'args' => [
                        'input' => Type::nonNull(GraphQLTypes::getProductInputType()),
                    ],
                    'resolve' => function($rootValue, $args) use ($productResolver) {
                        return $productResolver->createProduct($rootValue, $args);
                    },
                ],
                'updateProduct' => [
                    'type' => GraphQLTypes::getProductInterface(),
                    'args' => [
                        'id' => Type::nonNull(Type::string()),
                        'input' => Type::nonNull(GraphQLTypes::getProductInputType()),
                    ],
                    'resolve' => function($rootValue, $args) use ($productResolver) {
                        return $productResolver->updateProduct($rootValue, $args);
                    },
                ],
                'deleteProduct' => [
                    'type' => Type::boolean(),
                    'args' => [
                        'id' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function($rootValue, $args) use ($productResolver) {
                        return $productResolver->deleteProduct($rootValue, $args);
                    },
                ],
                'createAttribute' => [
                    'type' => GraphQLTypes::getAttributeInterface(),
                    'args' => [
                        'input' => Type::nonNull(GraphQLTypes::getAttributeInputType()),
                    ],
                    'resolve' => function($rootValue, $args) use ($attributeResolver) {
                        return $attributeResolver->createAttribute($rootValue, $args);
                    },
                ],
                'updateAttribute' => [
                    'type' => GraphQLTypes::getAttributeInterface(),
                    'args' => [
                        'id' => Type::nonNull(Type::string()),
                        'input' => Type::nonNull(GraphQLTypes::getAttributeInputType()),
                    ],
                    'resolve' => function($rootValue, $args) use ($attributeResolver) {
                        return $attributeResolver->updateAttribute($rootValue, $args);
                    },
                ],
                'deleteAttribute' => [
                    'type' => Type::boolean(),
                    'args' => [
                        'id' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function($rootValue, $args) use ($attributeResolver) {
                        return $attributeResolver->deleteAttribute($rootValue, $args);
                    },
                ],
            ],
        ]);
    }
}