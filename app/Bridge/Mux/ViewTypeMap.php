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
use Lucid\Template\ViewManagerInterface;

/**
 * @class RequestTypeMap
 *
 * @package App\Bridge\Mux
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class ViewTypeMap extends TypeMap
{
    /**
     * {@inheritdoc}
     */
    public function __construct(ContainerInterface $container, $key = 'view')
    {
        parent::__construct($container, $key, ViewManagerInterface::class);
    }
}
