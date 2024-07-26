<?php

namespace App\Repositories;

use App\Models\Attribute;

class AttributeRepository implements RepositoryInterface {
    protected $attribute;

    public function __construct(Attribute $attribute) {
        $this->attribute = $attribute;
    }

    public function findAll() {
        return $this->attribute->findAll();
    }

    public function findOne($id) {
        return $this->attribute->findOne($id);
    }

    public function create(array $data) {
        return $this->attribute->create($data);
    }

    public function getConnection() {
        return $this->attribute->getConnection();
    }

    // Implement update and delete methods as needed
}