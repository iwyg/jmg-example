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

use App\Events\RequestEvent;
use Lucid\Signal\EventDispatcherInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use SplPriorityQueue;

/**
 * @class Stack
 *
 * @package App\Middleware
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class Queue implements QueueInterface
{
    /** @var SplPriorityQueue */
    private $queue;

    /** @var EventDispatcherInterface */
    private $events;

    /** @var string */
    private $eventName;

    /**
     * Consructor.
     *
     * @param EventDispatcherInterface $events
     * @param string $eventName
     */
    public function __construct(EventDispatcherInterface $events, $eventName = 'kernel.middleware')
    {
        $this->events    = $events;
        $this->eventName = $eventName;
        $this->queue     = new SplPriorityQueue;
    }

    /**
     * {@inheritdoc}
     */
    public function add(MiddlewareInterface $middleware, $priority = null)
    {
        $this->queue->insert($middleware, $priority ?: $this->queue->count());
    }

    /**
     * {@inheritdoc}
     */
    public function handle(Request $request, Response $response = null)
    {
        $this->doHandle($request, $response);

        while ($this->queue->valid()) {
            list ($request, $response) =
                call_user_func_array([$this, 'doHandle'], $this->queue->current()->handle($request, $response));
            $this->queue->next();
        }

        $this->queue->rewind();

        return [$request, $response];
    }

    /**
     * doHandle
     *
     * @param Request $request
     * @param Response $response
     *
     * @return array [Request, Response]
     */
    public function doHandle(Request $request, Response $response = null)
    {
        $this->events->dispatch($this->eventName, $event = new RequestEvent($request, $response));

        return [$event->getRequest(), $event->getResponse()];
    }
}
