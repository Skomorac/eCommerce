<?php

// Include Composer's autoload file
require 'vendor/autoload.php';

// Include necessary files
require 'backend/Config/Database.php';
require 'backend/Models/Model.php';
require 'backend/Models/Attribute.php';

// Set up the environment (if necessary)
use App\Models\Attribute;

// Replace with a valid product ID from your database
$productId = 'apple-imac-2021';

// Fetch attributes for the given product ID
$attributes = Attribute::getByProductId($productId);

// Print the fetched attributes
echo '<pre>';
print_r($attributes);
echo '</pre>';

?>
