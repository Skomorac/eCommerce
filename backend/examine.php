// Simple test task. Requirements (PHP):
// 1 parent class, named Transport (or you can name it as you wish, just something logical)
// Parent class should have at least 3 variables
// 1 child class (any logical name for a class) which extends Transport
// Child class should have at least 2 variables
// In child class you should have set all 5 variables (at least), create a function within a class, set each variable value in a constructor, prepare an array with all variables in a function (including parent variables). 
// (function is in addition for a constructor, should be separate - constructor + function within the class).

<?php

class Transport {
    protected $brand;
    protected $model;
    protected $year;

    public function __construct( $brand, $model, $year ) {
        $this->brand = $brand;
        $this->model = $model;
        $this->year = $year;
    }

}

class Caddy extends Transport {
    private $color;
    private $fuelType;

    public function __construct( $brand, $model, $year, $color, $fuelType ) {
        parent::__construct( $brand, $model, $year );
        $this->color = $color;
        $this->fuelType = $fuelType;
    }

    public function getCaddyDetails() {
        return [
            'brand' => $this->brand,
            'model' => $this->model,
            'year' => $this->year,
            'color' => $this->color,
            'fuelType' => $this->fuelType
        ];
    }
}

// Usage

$myCaddy = new Caddy("Citroen", "Berlingo", 2024, "green", "diesel");
print_r($myCaddy->getCaddyDetails())

?>