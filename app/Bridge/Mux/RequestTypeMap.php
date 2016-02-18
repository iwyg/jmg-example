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
use Psr\Http\Message\ServerRequestInterface;

/**
 * @class RequestTypeMap
 *
 * @package App\Bridge\Mux
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class RequestTypeMap implements TypeMapperInterface
{
    public function __construct($container, $key = 'request')
    {
        $this->container = $container;
        $this->key = $key;
    }

    public function getType()
    {
        return ServerRequestInterface::class;
    }

    public function getObject()
    {
        return $this->container->get($this->key);
    }
}
