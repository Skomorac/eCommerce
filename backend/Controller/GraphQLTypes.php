<?php

namespace App\Controller;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class GraphQLTypes
{
    private static $categoryType;
    private static $tableType;
    private static $attributeResolver;
    private static $productInterface;
    private static $attributeInterface;
    private static $productInputType;
    private static $clothingProductType;
    private static $electronicsProductType;
    private static $textAttributeType;
    private static $colorAttributeType;
    private static $attributeInputType;

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

    // Check later for this function is maybe redundant
    public static function getProductType($attributeResolver = null)
    {
        return new ObjectType([
            'name' => 'Product',
            'interfaces' => [self::getProductInterface()], // Implement the ProductInterface
            'fields' => [
                'id' => ['type' => Type::nonNull(Type::string())],
                'name' => ['type' => Type::nonNull(Type::string())],
                'inStock' => ['type' => Type::boolean()],
                'gallery' => [
                    'type' => Type::listOf(Type::string()),
                    'resolve' => function($product) {
                        if (isset($product['gallery']) && is_string($product['gallery'])) {
                            return json_decode($product['gallery'], true);
                        }
                        return null;
                    }
                ],
                'description' => ['type' => Type::string()],
                'category' => ['type' => Type::string()],
                'brand' => ['type' => Type::string()],
                'attributes' => [
                    'type' => Type::listOf(self::getAttributeType()),
                    'resolve' => function($product) use ($attributeResolver) {
                        return $attributeResolver->resolveProductAttributes($product['id']);
                    },
                ],
                'size' => [
                    'type' => Type::string(),
                    'resolve' => function($product) {
                        if ($product['type'] === 'clothing') {
                            $clothingProduct = new \App\Models\ClothingProduct();
                            return $clothingProduct->getSize($product['id']);
                        }
                        return null;
                    },
                ],
                'warrantyPeriod' => [
                    'type' => Type::string(),
                    'resolve' => function($product) {
                        if ($product['type'] === 'electronics') {
                            $electronicsProduct = new \App\Models\ElectronicsProduct();
                            return $electronicsProduct->getWarrantyPeriod($product['id']);
                        }
                        return null;
                    },
                ],
            ],
        ]);
    }


    public static function getAttributeType()
    {
        return new ObjectType([
            'name' => 'Attribute',
            'fields' => [
                'id' => ['type' => Type::string()],
                'name' => ['type' => Type::string()],
                'type' => ['type' => Type::string()],
                'value' => ['type' => Type::string()],
                'hexValue' => [
                    'type' => Type::string(),
                    'resolve' => function($attribute) {
                        if ($attribute['type'] === 'color') {
                            $colorAttribute = new \App\Models\ColorAttribute();
                            return $colorAttribute->getHexValue($attribute['id']);
                        }
                        return null;
                    },
                ],
            ],
        ]);
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

    public static function getProductInterface()
    {
        if (!self::$productInterface) {
            self::$productInterface = new InterfaceType([
                'name' => 'ProductInterface',
                'fields' => [
                    'id' => ['type' => Type::nonNull(Type::string())],
                    'name' => ['type' => Type::nonNull(Type::string())],
                    'type' => ['type' => Type::nonNull(Type::string())],
                    'inStock' => ['type' => Type::nonNull(Type::boolean())],
                    'gallery' => ['type' => Type::listOf(Type::string())],
                    'description' => ['type' => Type::string()],
                    'category' => ['type' => Type::string()],
                    'brand' => ['type' => Type::string()],
                    'attributes' => ['type' => Type::listOf(self::getAttributeType())],
                    'size' => ['type' => Type::string()],
                    'warrantyPeriod' => ['type' => Type::string()],
                ],
                'resolveType' => function($value) {
                    return self::getProductType(); // Always resolve to ProductType
                }
            ]);
        }
        return self::$productInterface;
    }

    public static function getAttributeInterface()
    {
        if (!self::$attributeInterface) {
            self::$attributeInterface = new InterfaceType([
                'name' => 'AttributeInterface',
                'fields' => [
                    'id' => ['type' => Type::nonNull(Type::string())],
                    'name' => ['type' => Type::nonNull(Type::string())],
                    'type' => ['type' => Type::nonNull(Type::string())],
                    'value' => ['type' => Type::nonNull(Type::string())],
                ],
                'resolveType' => function($value) {
                    if ($value['type'] === 'text') {
                        return self::getTextAttributeType();
                    } elseif ($value['type'] === 'color') {
                        return self::getColorAttributeType();
                    }
                }
            ]);
        }
        return self::$attributeInterface;
    }

    public static function getProductInputType()
    {
        if (!self::$productInputType) {
            self::$productInputType = new InputObjectType([
                'name' => 'ProductInput',
                'fields' => [
                    'type' => ['type' => Type::nonNull(Type::string())],
                    'name' => ['type' => Type::nonNull(Type::string())],
                    'inStock' => ['type' => Type::nonNull(Type::boolean())],
                    'gallery' => ['type' => Type::listOf(Type::string())],
                    'description' => ['type' => Type::string()],
                    'category' => ['type' => Type::string()],
                    'brand' => ['type' => Type::string()],
                    'size' => ['type' => Type::string()], // for clothing products
                    'warrantyPeriod' => ['type' => Type::string()], // for electronics products
                ]
            ]);
        }
        return self::$productInputType;
    }

    public static function getAttributeInputType()
    {
        if (!self::$attributeInputType) {
            self::$attributeInputType = new InputObjectType([
                'name' => 'AttributeInput',
                'fields' => [
                    'type' => ['type' => Type::nonNull(Type::string())],
                    'name' => ['type' => Type::nonNull(Type::string())],
                    'value' => ['type' => Type::nonNull(Type::string())],
                ]
            ]);
        }
        return self::$attributeInputType;
    }

    public static function getClothingProductType()
    {
        if (!self::$clothingProductType) {
            self::$clothingProductType = new ObjectType([
                'name' => 'ClothingProduct',
                'interfaces' => [self::getProductInterface()],
                'fields' => function() {
                    return array_merge(self::getProductInterface()->getFields(), [
                        'size' => ['type' => Type::string()],
                    ]);
                }
            ]);
        }
        return self::$clothingProductType;
    }

    public static function getElectronicsProductType()
    {
        if (!self::$electronicsProductType) {
            self::$electronicsProductType = new ObjectType([
                'name' => 'ElectronicsProduct',
                'interfaces' => [self::getProductInterface()],
                'fields' => function() {
                    return array_merge(self::getProductInterface()->getFields(), [
                        'warrantyPeriod' => ['type' => Type::string()],
                    ]);
                }
            ]);
        }
        return self::$electronicsProductType;
    }

    public static function getTextAttributeType()
    {
        if (!self::$textAttributeType) {
            self::$textAttributeType = new ObjectType([
                'name' => 'TextAttribute',
                'interfaces' => [self::getAttributeInterface()],
                'fields' => function() {
                    return self::getAttributeInterface()->getFields();
                }
            ]);
        }
        return self::$textAttributeType;
    }

    public static function getColorAttributeType()
    {
        if (!self::$colorAttributeType) {
            self::$colorAttributeType = new ObjectType([
                'name' => 'ColorAttribute',
                'interfaces' => [self::getAttributeInterface()],
                'fields' => function() {
                    return array_merge(self::getAttributeInterface()->getFields(), [
                        'hexValue' => ['type' => Type::string()],
                    ]);
                }
            ]);
        }
        return self::$colorAttributeType;
    }

    public static function getTypes()
    {
        return [
            self::getProductInterface(),
            self::getClothingProductType(),
            self::getElectronicsProductType(),
            self::getAttributeInterface(),
            self::getTextAttributeType(),
            self::getColorAttributeType(),
        ];
    }
}