<?php

require_once __DIR__ . '/vendor/autoload.php';

$classes = get_declared_classes();
foreach ($classes as $class) {
    echo $class . "\n";
}
