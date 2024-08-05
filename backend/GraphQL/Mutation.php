<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use App\GraphQL\Types\OrderInputType;
use App\GraphQL\Resolvers\OrdersResolver;
use App\GraphQL\Resolvers\CategoriesResolver;
use GraphQL\Error\Error;
use Exception;

class Mutation
{
    public static function defineMutations(): ObjectType
    {
        return new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'placeOrder' => [
                    'type' => Type::string(),
                    'args' => [
                        'OrderInput' => Type::nonNull(OrderInputType::getInstance()),
                    ],
                    'resolve' => function ($rootValue, array $args) {
                        try {
                            return OrdersResolver::store($args['OrderInput']);
                        } catch (Exception $e) {
                            error_log('Error in placeOrder mutation: ' . $e->getMessage());
                            error_log('Stack trace: ' . $e->getTraceAsString());
                            return new Error('Server error: ' . $e->getMessage());
                        }
                    },
                ],
                'addCategory' => [
                    'type' => Type::string(),
                    'args' => [
                        'name' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function ($rootValue, array $args) {
                        try {
                            return CategoriesResolver::addCategory($args['name']);
                        } catch (Exception $e) {
                            error_log('Error in addCategory mutation: ' . $e->getMessage());
                            error_log('Stack trace: ' . $e->getTraceAsString());
                            return new Error('Server error: ' . $e->getMessage());
                        }
                    },
                ],
            ],
        ]);
    }
}
