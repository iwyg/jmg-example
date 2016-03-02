<?php

/*
 * This File is part of the App package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App;

use App\Events\RequestEvent;
use Lucid\Signal\EventDispatcherInterface;
use Zend\Diactoros\Response;
use Interop\Container\ContainerInterface;
use Zend\Diactoros\ServerRequestFactory;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Lucid\Mux\Request\Context as RequestContext;
use App\Middleware\MiddlewareInterface;

/**
 * @class Kernel
 *
 * @package App
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class Kernel
{
    private $container;
    private $middleware;
    private $booted;

    public function __construct(ContainerInterface $container)
    {
        $this->booted = false;
        $this->container = $container;
        $this->emitter = new \Zend\Diactoros\Response\SapiEmitter;
        $this->middleware = new \SplStack;
    }

    public function middleware(MiddlewareInterface $middleware)
    {
        $this->middleware->push($middleware);
    }

    public function handle(ServerRequestInterface $request)
    {
        //$this->container['request'] = $request;


        list($request, $response) = $this->flushMiddleware($request);

        if (null !== $response) {
            return $response;
        }

        //$router = $this->container->get('router');
        //$match = $router->match($rc = RequestContext::fromPsrRequest($request));

        //if (!$match->isMatch()) {
            //return new Response('php://temp', 404);
        //}

        //foreach ($match->getVars() as $key => $value) {
            //$request = $request->withAttribute($key, $value);
        //}

        //$this->container['request'] = $request;

        //$response = $router->dispatchMatch($match);

        return $response;
    }

    public function boot()
    {
        if ($this->booted) {
            return false;
        }

        $this->registerEvents();

        return $this->booted = true;
    }

    public function run()
    {
        $request = ServerRequestFactory::fromGlobals();

        $this->boot();
        $response = $this->handle($request);

        $this->emitter->emit($response);
    }

    protected function registerEvents()
    {
        $func = require dirname(__DIR__).'/config/events.php';
        $func($this->container, $this->container->get('events'));
    }

    private function flushMiddleware(ServerRequestInterface $request, ResponseInterface $response = null)
    {
        $mdw = null;

        $events = $this->container->get('events');
        $this->dispatchMiddlewareEvent($events, $request, $response);

        $this->middleware->rewind();
        while ($this->middleware->valid()) {
            $next = $this->middleware->current();
            $this->middleware->next();
            list($request, $response) = $next->handle($request, $response);
            $this->dispatchMiddlewareEvent($events, $request, $response);
            $mdw = $next;
        }

        $this->middleware->rewind();

        return [$request, $response];
    }

    private function dispatchMiddlewareEvent(
        EventDispatcherInterface $events,
        ServerRequestInterface $request,
        ResponseInterface $response = null
    ) {
        //$events->dispatch('kernel.middleware', new RequestEvent($request, $response));
    }
}
