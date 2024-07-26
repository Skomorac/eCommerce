<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository implements RepositoryInterface {
    protected $product;

    public function __construct(Product $product) {
        $this->product = $product;
    }

    public function findAll() {
        return $this->product->findAll();
    }

    public function findOne($id) {
        return $this->product->findOne($id);
    }

    public function create(array $data) {
        return $this->product->create($data);
    }

    // Implement update and delete methods as needed
}