<?php

namespace App\GraphQL;

use Throwable;
use RuntimeException;
use GraphQL\Type\Schema;
use App\GraphQL\Query;
use App\GraphQL\Mutation;
use GraphQL\Type\SchemaConfig;
use GraphQL\GraphQL as GraphQLBase;

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

    // public static function handle()
    // {
    //     echo "Debug: Inside Controller::handle()\n";
    //     try {
    //         $queryType = Query::defineQueries();
    //         echo "Debug: Queries defined\n";
    //         $mutationType = Mutation::defineMutations();
    //         echo "Debug: Mutations defined\n";

    //         $schema = new Schema(
    //             (new SchemaConfig())
    //                 ->setQuery($queryType)
    //                 ->setMutation($mutationType)
    //         );
    //         echo "Debug: Schema created\n";

    //         $output = self::executeQuery($schema);
    //         echo "Debug: Query executed\n";
    //     } catch (Throwable $e) {
    //         echo "Debug: Exception in Controller::handle(): " . $e->getMessage() . "\n";
    //         echo "Debug: Stack trace: " . $e->getTraceAsString() . "\n";
    //         $output = [
    //             'errors' => [
    //                 [
    //                     'message' => 'Internal server error: ' . $e->getMessage(),
    //                     'locations' => [['line' => 1, 'column' => 1]],
    //                 ]
    //             ]
    //         ];
    //     }

    //     return $output;
    // }

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