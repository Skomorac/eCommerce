<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\Type;
use App\GraphQL\Types\OrderInputType;
use GraphQL\Type\Definition\ObjectType;
use App\GraphQL\Resolvers\OrdersResolver;

class Mutation
{
    public static function defineMutations(): ObjectType
    {
        return new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'sum' => [
                    'type' => Type::int(),
                    'args' => [
                        'x' => ['type' => Type::int()],
                        'y' => ['type' => Type::int()],
                    ],
                    'resolve' => static fn ($calc, array $args): int => $args['x'] + $args['y'],
                ],
                'placeOrder' => [
                    'type' => Type::string(),
                    'args' => [
                        'OrderInput' => Type::nonNull(new OrderInputType()),
                    ],
                    'resolve' => static fn ($rootValue, array $args) => OrdersResolver::store($args['OrderInput']),
                ],
            ],
        ]);
    }
}
