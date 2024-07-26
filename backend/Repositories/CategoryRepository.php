<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository implements RepositoryInterface {
    protected $category;

    public function __construct(Category $category) {
        $this->category = $category;
    }

    public function findAll() {
        return $this->category->findAll();
    }

    public function findOne($name) {
        return $this->category->findOne($name);
    }

    public function create($name) {
        return $this->category->create($name);
    }

    public function update($oldName, $newName) {
        return $this->category->update($oldName, $newName);
    }

    public function delete($name) {
        return $this->category->delete($name);
    }
}