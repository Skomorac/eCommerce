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

    public function resolveGallery($product)
    {
        if (isset($product['gallery']) && is_string($product['gallery'])) {
            return json_decode($product['gallery'], true);
        }
        return null;
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