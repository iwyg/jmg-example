<?php

/*
 * This File is part of the App\Middleware package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Middleware;

/**
 * @interface StackInterface
 *
 * @package App\Middleware
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
interface QueueInterface extends MiddlewareInterface
{
    /**
     * add
     *
     * @param MiddlewareInterface $middleware
     * @param int $priority
     *
     * @return self
     */
    public function add(MiddlewareInterface $middleware, $priority = null);
}
