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

    public function resolveCategory($rootValue, array $args) {
        return $this->repository->findOne($args['name']);
    }

    public function createCategory($rootValue, array $args) {
        return $this->repository->create($args['name']);
    }

    public function updateCategory($rootValue, array $args) {
        return $this->repository->update($args['oldName'], $args['newName']);
    }

    public function deleteCategory($rootValue, array $args) {
        return $this->repository->delete($args['name']);
    }
}