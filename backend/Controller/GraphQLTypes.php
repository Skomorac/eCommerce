<?php

namespace App\Controller;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class GraphQLTypes
{
    private static $categoryType;
    private static $productType;
    private static $attributeType;
    private static $tableType;
    private static $attributeResolver;

    public static function init($attributeResolver)
    {
        self::$attributeResolver = $attributeResolver;
    }

    public static function getCategoryType()
    {
        return self::$categoryType ?: (self::$categoryType = new ObjectType([
            'name' => 'Category',
            'fields' => [
                'name' => ['type' => Type::string()],
            ],
        ]));
    }

    public static function getProductType($attributeResolver = null)
    {
        $resolver = $attributeResolver ?: self::$attributeResolver;
        return self::$productType ?: (self::$productType = new ObjectType([
            'name' => 'Product',
            'fields' => [
                'id' => ['type' => Type::string()],
                'name' => ['type' => Type::string()],
                'inStock' => ['type' => Type::boolean()],
                'gallery' => ['type' => Type::listOf(Type::string())],
                'description' => ['type' => Type::string()],
                'category' => ['type' => Type::string()],
                'brand' => ['type' => Type::string()],
                'attributes' => [
                    'type' => Type::listOf(self::getAttributeType()),
                    'resolve' => function($product) use ($resolver) {
                        return $resolver->resolveProductAttributes($product['id']);
                    },
                ],
            ],
        ]));
    }

    public static function getAttributeType()
    {
        return self::$attributeType ?: (self::$attributeType = new ObjectType([
            'name' => 'Attribute',
            'fields' => [
                'id' => ['type' => Type::string()],
                'name' => ['type' => Type::string()],
                'type' => ['type' => Type::string()],
            ],
        ]));
    }

    public static function getTableType()
    {
        return self::$tableType ?: (self::$tableType = new ObjectType([
            'name' => 'Table',
            'fields' => [
                'name' => ['type' => Type::string()],
            ],
        ]));
    }
}