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

use Lucid\Mux\Handler\TypeMapperInterface;
use Lucid\Template\EngineInterface;

/**
 * @class RequestTypeMap
 *
 * @package App\Bridge\Mux
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class ViewTypeMap implements TypeMapperInterface
{
    public function __construct($container, $key = 'view')
    {
        $this->container = $container;
        $this->key = $key;
    }

    public function getType()
    {
        return EngineInterface::class;
    }

    public function getObject()
    {
        return $this->container->get($this->key);
    }
}
