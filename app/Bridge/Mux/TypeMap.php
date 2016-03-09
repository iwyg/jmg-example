<?php

/*
 * This File is part of the App\Bridge\Mux package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Bridge\Mux;

use Interop\Container\ContainerInterface;
use Lucid\Mux\Handler\TypeMapperInterface;

/**
 * @class AbstractTypeMap
 *
 * @package App\Bridge\Mux
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class TypeMap implements TypeMapperInterface
{
    /** @var ContainerInterface */
    private $container;

    /** @var string */
    private $key;

    /** @var type */
    private $type;

    /**
     * Constructor.
     *
     * @param ContainerInterface $container
     * @param string $key
     * @param string $type
     */
    public function __construct(ContainerInterface $container, $key, $type)
    {
        $this->container = $container;
        $this->key = $key;
        $this->type = $type;
    }

    /**
     * {@inheritdoc}
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * {@inheritdoc}
     */
    public function getObject()
    {
        return $this->container->get($this->key);
    }
}
