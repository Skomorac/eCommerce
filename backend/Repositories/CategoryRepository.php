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

    public function create($name) {
        return $this->category->create($name);
    }
}