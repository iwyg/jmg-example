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

use Lucid\Signal\EventDispatcherInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * @class XhttpRequestMiddleWare
 *
 * @package App\Middleware
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class XhrRequest implements MiddlewareInterface
{
    private $events;

    public function __construct(EventDispatcherInterface $events)
    {
        $this->events = $events;
    }

    public function handle(Request $request, Response $response = null)
    {
        if ($this->isXHRRequest($request)) {
            $this->events->dispatch('request.xhr', $event = new XhrRequestEvent($request, $response));
            $request = $event->getRequest() ?: $request;
            $response = $event->getResponse() ?: $response;
        }

        return [$request, $response];
    }

    private function isXHRRequest($request)
    {
        if ((bool)($xhttp = $request->getHeader('http_x_requested_with'))) {
            return true;
        }

        return false;
    }
}
