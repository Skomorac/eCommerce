<?php

namespace App\Resolvers;

use App\Repositories\AttributeRepository;

class AttributeResolver extends Resolver
{
    protected $repository;

    public function __construct(AttributeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function resolveAttributes()
    {
        return $this->repository->findAll();
    }

    public function resolveAttribute($rootValue, array $args)
    {
        return $this->repository->findOne($args['id']);
    }

    public function resolveProductAttributes($productId)
    {
        try {
            $query = "SELECT DISTINCT a.id, a.name, a.type, a.value FROM attributes a
                      JOIN product_attributes pa ON a.id = pa.attribute_id
                      WHERE pa.product_id = :productId";
            $stmt = $this->repository->getConnection()->prepare($query);
            $stmt->bindParam(':productId', $productId);
            $stmt->execute();
            $attributes = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            // Process attributes based on their type
            return array_map(function($attribute) {
                if ($attribute['type'] === 'color') {
                    $attribute['hexValue'] = $this->repository->getHexValue($attribute['id']);
                }
                return $attribute;
            }, $attributes);

        } catch (\Exception $e) {
            error_log('Error in resolveProductAttributes: ' . $e->getMessage());
            return [];
        }
    }

    public function createAttribute($rootValue, array $args)
    {
        return $this->repository->create($args['input']);
    }

    public function updateAttribute($rootValue, array $args)
    {
        return $this->repository->update($args['id'], $args['input']);
    }

    public function deleteAttribute($rootValue, array $args)
    {
        return $this->repository->delete($args['id']);
    }
}