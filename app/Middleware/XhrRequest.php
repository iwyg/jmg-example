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

use App\Events\XhrRequestEvent;
use Lucid\Signal\EventDispatcherInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Lucid\Infuse\MiddlewareInterface;

/**
 * @class XhttpRequestMiddleWare
 *
 * @package App\Middleware
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class XhrRequest implements MiddlewareInterface
{
    /** @var EventDispatcherInterface  */
    private $events;

    /**
     * XhrRequest constructor.
     * @param EventDispatcherInterface $events
     */
    public function __construct(EventDispatcherInterface $events)
    {
        $this->events = $events;
    }

    /**
     * {@inheritdoc}
     */
    public function handle(Request $request, Response $response)
    {
        if ($this->isXHRRequest($request)) {
            $this->events->dispatch('request.xhr', $event = new XhrRequestEvent($request, $response));
            $request = $event->getRequest() ?: $request;
            $response = $event->getResponse() ?: $response;
        }

        return [$request, $response];
    }

    /**
     * @param $request
     * @return bool
     */
    private function isXHRRequest(Request $request)
    {
        return (bool)($request->getHeader('http_x_requested_with'));
    }
}
