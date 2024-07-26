<?php

namespace App\Resolvers;

use App\Repositories\ProductRepository;

class ProductResolver extends Resolver {
    protected $repository;

    public function __construct(ProductRepository $repository) {
        $this->repository = $repository;
    }

    public function resolveProducts() {
        return $this->repository->findAll();
    }

    public function resolveProduct($rootValue, array $args) {
        return $this->repository->findOne($args['id']);
    }

    // Implement create, update, and delete methods as needed
}