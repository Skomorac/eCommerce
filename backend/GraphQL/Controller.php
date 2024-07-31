<?php

namespace App\GraphQL;

use Throwable;
use RuntimeException;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use GraphQL\GraphQL as GraphQLBase;
use App\GraphQL\Query;
use App\GraphQL\Mutation;

class Controller
{
    public static function handle()
    {
        try {
            $queryType = Query::defineQueries();
            $mutationType = Mutation::defineMutations();

            $schema = new Schema(
                (new SchemaConfig())
                    ->setQuery($queryType)
                    ->setMutation($mutationType)
            );

            $output = self::executeQuery($schema);
        } catch (Throwable $e) {
            error_log('Error in Controller::handle: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            $output = [
                'errors' => [
                    [
                        'message' => 'Internal server error: ' . $e->getMessage(),
                        'locations' => [['line' => 1, 'column' => 1]],
                    ]
                ]
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
        exit;
    }


    private static function executeQuery(Schema $schema): array
    {
        try {
            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'] ?? null;
            $variableValues = $input['variables'] ?? null;

            if ($query === null) {
                throw new RuntimeException('No query provided');
            }

            $rootValue = ['prefix' => 'You said: '];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            return $result->toArray();
        } catch (Throwable $e) {
            error_log('Error in executeQuery: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }
}
