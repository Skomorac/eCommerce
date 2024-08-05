<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/backend/Config/database.php';

use App\Config\Database;

try {
    $db = new Database();
    $connection = $db->getConnection();

    // Perform a simple query
    $result = $db->query("SELECT 1 as test")->fetch();

    if ($result && $result['test'] == 1) {
        echo "Database connection successful!";
    } else {
        echo "Database connection successful, but unexpected result.";
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}