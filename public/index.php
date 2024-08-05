<?php
file_put_contents(__DIR__ . '/php-error.log', "Test log entry: " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set up error logging
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');

require_once __DIR__ . '/../vendor/autoload.php';

use FastRoute\RouteCollector;
use FastRoute\Dispatcher;
use App\GraphQL\Controller;

// Add CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dispatcher = FastRoute\simpleDispatcher(function(RouteCollector $r) {
    $r->addRoute('GET', '/test', function() {
        return "Route is working!";
    });

    $r->addRoute('POST', '/graphql', [Controller::class, 'handle']);

    // $r->addRoute('POST', '/graphql', function() {
    //     try {
    //         echo "Debug: About to call Controller::handle()\n";
    //         $result = Controller::handle();
    //         echo "Debug: Controller::handle() completed\n";
    //         return $result;
    //     } catch (Throwable $e) {
    //         echo "Debug: Exception caught: " . $e->getMessage() . "\n";
    //         echo "Debug: Stack trace: " . $e->getTraceAsString() . "\n";
    //         throw $e;
    //     }
    // });
});

try {
    $routeInfo = $dispatcher->dispatch(
        $_SERVER['REQUEST_METHOD'],
        parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
    );

    switch ($routeInfo[0]) {
        case Dispatcher::NOT_FOUND:
            http_response_code(404);
            echo json_encode(['error' => '404 Not Found']);
            break;
        case Dispatcher::METHOD_NOT_ALLOWED:
            $allowedMethods = $routeInfo[1];
            http_response_code(405);
            echo json_encode(['error' => '405 Method Not Allowed']);
            break;
        case Dispatcher::FOUND:
            $handler = $routeInfo[1];
            $vars = $routeInfo[2];
            if (is_callable($handler)) {
                $response = call_user_func_array($handler, [$vars]);
            } elseif (is_array($handler) && is_callable([new $handler[0], $handler[1]])) {
                $response = call_user_func_array([new $handler[0], $handler[1]], [$vars]);
            } else {
                throw new Exception('Invalid handler');
            }
            if (!is_string($response)) {
                $response = json_encode($response);
            }
            echo $response;
            break;
    }
} catch (Exception $e) {
    error_log('Uncaught exception: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    http_response_code(500);
    echo json_encode([
        'errors' => [
            [
                'message' => 'Internal server error: ' . $e->getMessage(),
                'locations' => [['line' => 1, 'column' => 1]],
            ]
        ]
    ]);
}