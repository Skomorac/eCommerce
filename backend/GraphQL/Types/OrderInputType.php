<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\InputObjectType;

class OrderInputType extends InputObjectType
{
    private static $instance = null;

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        parent::__construct([
            'name' => 'OrderInput',
            'fields' => [
                'items' => [
                    'type' => Type::nonNull(Type::listOf(OrderItemInputType::getInstance()))
                ],
                'totalAmount' => [
                    'type' => Type::nonNull(Type::float()),
                ],
            ],
        ]);
    }
}
