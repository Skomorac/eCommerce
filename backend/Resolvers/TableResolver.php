<?php

namespace App\Resolvers;

use App\Repositories\TableRepository;

class TableResolver extends Resolver
{
    protected $repository;

    public function __construct(TableRepository $repository)
    {
        $this->repository = $repository;
    }

    public function resolveTables()
    {
        return $this->repository->findAll();
    }
}