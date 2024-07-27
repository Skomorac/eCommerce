<?php

namespace App\Repositories;

use App\Models\BaseAttribute;
use App\Models\TextAttribute;
use App\Models\ColorAttribute;

class AttributeRepository implements RepositoryInterface
{
    /**
     * @var array<string, class-string<BaseAttribute>>
     */
    private $attributeTypes = [
        'text' => TextAttribute::class,
        'color' => ColorAttribute::class,
    ];

    /**
     * @param string $type
     * @return BaseAttribute
     * @throws \InvalidArgumentException
     */
    private function createAttributeInstance(string $type): BaseAttribute
    {
        if (!isset($this->attributeTypes[$type])) {
            throw new \InvalidArgumentException("Invalid attribute type: $type");
        }
        $class = $this->attributeTypes[$type];
        return new $class();
    }

    public function findAll()
    {
        $allAttributes = [];
        foreach ($this->attributeTypes as $type => $class) {
            $attribute = $this->createAttributeInstance($type);
            $allAttributes = array_merge($allAttributes, $attribute->findAll());
        }
        return $allAttributes;
    }

    public function findOne($id)
    {
        foreach ($this->attributeTypes as $type => $class) {
            $attribute = $this->createAttributeInstance($type);
            $result = $attribute->findOne($id);
            if ($result) {
                return $result;
            }
        }
        return null;
    }

    public function create(array $data)
    {
        if (!isset($data['type']) || !isset($this->attributeTypes[$data['type']])) {
            throw new \InvalidArgumentException("Invalid or missing attribute type");
        }

        $attribute = $this->createAttributeInstance($data['type']);
        return $attribute->create($data);
    }

    public function update($id, array $data)
    {
        $existingAttribute = $this->findOne($id);
        if (!$existingAttribute) {
            return null;
        }

        $attribute = $this->createAttributeInstance($existingAttribute['type']);
        return $attribute->update($id, $data);
    }

    public function delete($id)
    {
        $existingAttribute = $this->findOne($id);
        if (!$existingAttribute) {
            return false;
        }

        $attribute = $this->createAttributeInstance($existingAttribute['type']);
        return $attribute->delete($id);
    }

    public function getConnection()
    {
        $anyAttributeType = array_key_first($this->attributeTypes);
        $attribute = $this->createAttributeInstance($anyAttributeType);
        return $attribute->getConnection();
    }

    public function getHexValue($attributeId)
    {
        $attribute = $this->findOne($attributeId);
        if ($attribute && $attribute['type'] === 'color') {
            $colorAttribute = $this->createAttributeInstance('color');
            if ($colorAttribute instanceof ColorAttribute) {
                return $colorAttribute->getHexValue($attributeId);
            }
        }
        return null;
    }
}