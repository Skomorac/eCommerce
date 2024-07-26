<?php

namespace App\Resolvers;

use App\Repositories\CategoryRepository;

class CategoryResolver extends Resolver {
    protected $repository;

    public function __construct(CategoryRepository $repository) {
        $this->repository = $repository;
    }

    public function resolveCategories() {
        return $this->repository->findAll();
    }

    public function createCategory($rootValue, array $args) {
        return $this->repository->create($args['name']);
    }
}