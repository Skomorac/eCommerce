<?php

namespace App\Repositories;

use App\Models\BaseProduct;
use App\Models\ClothingProduct;
use App\Models\ElectronicsProduct;

class ProductRepository implements RepositoryInterface
{
    /**
     * @var array<string, class-string<BaseProduct>>
     */
    private $productTypes = [
        'clothes' => ClothingProduct::class,
        'tech' => ElectronicsProduct::class,
    ];

    /**
     * @param string $type
     * @return BaseProduct
     * @throws \InvalidArgumentException
     */
    private function createProductInstance(string $type): BaseProduct
    {
        if (!isset($this->productTypes[$type])) {
            throw new \InvalidArgumentException("Invalid product type: $type");
        }
        $class = $this->productTypes[$type];
        return new $class();
    }

    public function findAll()
    {
        $allProducts = [];
        foreach ($this->productTypes as $type => $class) {
            $product = $this->createProductInstance($type);
            $allProducts = array_merge($allProducts, $product->findAll());
        }
        return $allProducts;
    }

    public function findOne($id)
    {
        foreach ($this->productTypes as $type => $class) {
            $product = $this->createProductInstance($type);
            $result = $product->findOne($id);
            if ($result) {
                return $result;
            }
        }
        return null;
    }

    public function create(array $data)
    {
        if (!isset($data['category']) || !isset($this->productTypes[$data['category']])) {
            throw new \InvalidArgumentException("Invalid or missing product category");
        }

        $product = $this->createProductInstance($data['category']);
        return $product->create($data);
    }

    public function update($id, array $data)
    {
        $existingProduct = $this->findOne($id);
        if (!$existingProduct) {
            return null;
        }

        $product = $this->createProductInstance($existingProduct['category']);
        return $product->update($id, $data);
    }

    public function delete($id)
    {
        $existingProduct = $this->findOne($id);
        if (!$existingProduct) {
            return false;
        }

        $product = $this->createProductInstance($existingProduct['category']);
        return $product->delete($id);
    }
}