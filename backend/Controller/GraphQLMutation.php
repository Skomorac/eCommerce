<?php

namespace App\Controller;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\GraphQL\Types;

class GraphQLMutation
{
    public static function getMutationType($categoryResolver)
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
            ],
        ]);
    }
}