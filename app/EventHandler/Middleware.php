<?php

/*
 * This File is part of the App\EventHandler package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\EventHandler;

use App\Events\RequestEvent;
use Lucid\Signal\EventInterface;
use Lucid\Signal\HandlerInterface;

/**
 * @class MiddlewareListener
 *
 * @package App\EventHandler
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class Middleware implements HandlerInterface
{
    private $set;

    public function __construct(callable $containerSetter)
    {
        $this->set = $containerSetter;
    }

    /**
     * {@inheritdoc}
     */
    public function handleEvent(EventInterface $event)
    {
        if ($event instanceof RequestEvent) {
            call_user_func($this->set, 'request', $event->getRequest());
            call_user_func($this->set, 'response', $event->getResponse());
        }
    }
}
