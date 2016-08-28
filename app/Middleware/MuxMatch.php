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
use Zend\Diactoros\Response;
use Lucid\Mux\RouterInterface;
use Lucid\Signal\EventDispatcherInterface;
use Lucid\Mux\Request\Context as RequestContext;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Lucid\Infuse\MiddlewareInterface;


/**
 * @class Mux
 *
 * @package App\Middleware
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class MuxMatch implements MiddlewareInterface
{
    /** @var RouterInterface */
    private $router;

    /** @var EventDispatcherInterface */
    private $events;

    /**
     * Constructor.
     *
     * @param RouterInterface $router
     * @param EventDispatcherInterface $events
     */
    public function __construct(RouterInterface $router, EventDispatcherInterface $events)
    {
        $this->router = $router;
        $this->events = $events;
    }

    /**
     * Will call a match and dispatch on the router.
     *
     * Only fires if response is still null.
     *
     * {@inheritdoc}
     */
    public function handle(Request $request, ResponseInterface $response)
    {
        list($request, $response) = $this->match($request, $response);

        return [$request, $response];
    }

    /**
     * match
     *
     * @param Request $request
     * @param Response $response
     *
     * @return array
     */
    private function match(Request $request, Response $response = null)
    {
        $match = $this->router->match($rc = RequestContext::fromPsrRequest($request));

        if (!$match->isMatch()) {
            return [$request, new Response('php://temp', 404)];
        }

        foreach ($match->getVars() as $key => $value) {
            $request = $request->withAttribute($key, $value);
        }

        $this->events->dispatch('kernel.middleware', new RequestEvent($request, $response));

        $response = $this->router->dispatchMatch($match);

        return [$request, $response];
    }
}
