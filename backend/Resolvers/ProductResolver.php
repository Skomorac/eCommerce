<?php

namespace App\Resolvers;

use App\Repositories\ProductRepository;

class ProductResolver extends Resolver
{
    protected $repository;

    public function __construct(ProductRepository $repository)
    {
        $this->repository = $repository;
    }

    public function resolveProducts()
    {
        return $this->repository->findAll();
    }

    public function resolveProduct($rootValue, array $args)
    {
        return $this->repository->findOne($args['id']);
    }

    public function createProduct($rootValue, array $args)
    {
        return $this->repository->create($args['input']);
    }

    public function updateProduct($rootValue, array $args)
    {
        return $this->repository->update($args['id'], $args['input']);
    }

    public function deleteProduct($rootValue, array $args)
    {
        return $this->repository->delete($args['id']);
    }
}