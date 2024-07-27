<?php

namespace App\Resolvers;

use App\Repositories\AttributeRepository;

class AttributeResolver extends Resolver {
    protected $repository;

    public function __construct(AttributeRepository $repository) {
        $this->repository = $repository;
    }

    public function resolveProductAttributes($productId) {
        try {
            $query = "SELECT DISTINCT a.id, a.name, a.type FROM attributes a
                      JOIN product_attributes pa ON a.id = pa.attribute_id
                      WHERE pa.product_id = :productId";
            $stmt = $this->repository->getConnection()->prepare($query);
            $stmt->bindParam(':productId', $productId);
            $stmt->execute();
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\Exception $e) {
            // Log the error
            error_log('Error in resolveProductAttributes: ' . $e->getMessage());
            return null; // or return an empty array []
        }
    }
}