<?php

namespace App\Models;

class Category extends Model
{
    protected static $table = 'categories';

    // Define the attributes that can be mass assigned
    public $name;

    // Add the save method to handle inserting new records
    public function save()
    {
        $db = self::getDB();
        $stmt = $db->prepare('INSERT INTO ' . self::getTable() . ' (name) VALUES (:name)');
        $stmt->bindParam(':name', $this->name);
        return $stmt->execute();
    }
}
