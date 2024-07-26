<?php

namespace App\Resolvers;

use App\Repositories\AttributeRepository;

class AttributeResolver extends Resolver {
    protected $repository;

    public function __construct(AttributeRepository $repository) {
        $this->repository = $repository;
    }

    public function resolveAttributes() {
        return $this->repository->findAll();
    }

    public function resolveAttribute($rootValue, array $args) {
        return $this->repository->findOne($args['id']);
    }

    public function resolveProductAttributes($productId) {
        $query = "SELECT DISTINCT a.id, a.name, a.type FROM attributes a
                  JOIN product_attributes pa ON a.id = pa.attribute_id
                  WHERE pa.product_id = :productId";
        $stmt = $this->repository->getConnection()->prepare($query);
        $stmt->bindParam(':productId', $productId);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Implement create, update, and delete methods as needed
}