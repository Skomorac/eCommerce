<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use RuntimeException;
use Throwable;

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class GraphQL {
    static public function handle() {
        try {
            // Load environment variables from .env file
            $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
            $dotenv->load();

            // Retrieve database connection details from environment variables
            $servername = $_ENV['DB_HOST'];
            $username = $_ENV['DB_USER'];
            $password = $_ENV['DB_PASS'];
            $database = $_ENV['DB_NAME'];

            // Create connection
            $conn = new \mysqli($servername, $username, $password, $database);

            // Check connection
            if ($conn->connect_error) {
                throw new RuntimeException('Connection failed: ' . $conn->connect_error);
            }

            $categoryType = new ObjectType([
                'name' => 'Category',
                'fields' => [
                    'name' => ['type' => Type::string()],
                ],
            ]);

            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'echo' => [
                        'type' => Type::string(),
                        'args' => [
                            'message' => ['type' => Type::string()],
                        ],
                        'resolve' => static fn ($rootValue, array $args): string => $rootValue['prefix'] . $args['message'],
                    ],
                    'tables' => [
                        'type' => Type::listOf(Type::string()),
                        'resolve' => function () use ($conn) {
                            $tables = [];
                            $result = $conn->query("SHOW TABLES");
                            if (!$result) {
                                throw new RuntimeException('Query failed: ' . $conn->error);
                            }
                            while ($row = $result->fetch_array(MYSQLI_NUM)) {
                                $tables[] = $row[0];
                            }
                            return $tables;
                        },
                    ],
                    'categories' => [
                        'type' => Type::listOf($categoryType),
                        'resolve' => function () use ($conn) {
                            $categories = [];
                            $result = $conn->query("SELECT name FROM categories");
                            if (!$result) {
                                throw new RuntimeException('Query failed: ' . $conn->error);
                            }
                            while ($row = $result->fetch_assoc()) {
                                $categories[] = ['name' => $row['name']];
                            }
                            return $categories;
                        },
                    ],
                ],
            ]);

            $schema = new Schema([
                'query' => $queryType,
            ]);

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            $rootValue = ['prefix' => 'You said: '];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    }
}
