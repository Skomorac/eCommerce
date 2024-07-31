<?php

namespace App\Models;

use PDO;
use App\Config\Database;
use ReflectionClass;

abstract class Model
{
    protected static $db;
    protected static $table;

    public static function getDB()
    {
        if (!isset(self::$db)) {
            self::$db = Database::getInstance()->getConnection();
        }
        return self::$db;
    }

    public static function getTable()
    {
        $calledClass = get_called_class();
        if (!isset($calledClass::$table)) {
            $calledClass::$table = strtolower((new ReflectionClass($calledClass))->getShortName()) . 's';
        }
        return $calledClass::$table;
    }

    public static function all(): array
    {
        $stmt = self::getDB()->query('SELECT * FROM ' . static::getTable());
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find(string $value, ?string $column = 'id'): ?array
    {
        $stmt = self::getDB()->prepare('SELECT * FROM ' . static::getTable() . ' WHERE ' . $column . ' = :value LIMIT 1');
        $stmt->execute(['value' => $value]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ?: null;
    }
}