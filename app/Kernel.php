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
    /** @var ContainerInterface */
    private $container;

    /** @var App\Middleware\QueueInterface */
    private $middleware;

    /** @var bool */
    private $booted;

    /**
     * Consructor.
     *
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->booted = false;
        $this->container = $container;
        $this->emitter = new \Zend\Diactoros\Response\SapiEmitter;
    }

    /**
     * Boots the kernel.
     *
     * @return bool
     */
    public function boot()
    {
        if ($this->booted) {
            return false;
        }

        $this->registerEvents();

        return $this->booted = true;
    }


    /**
     * handles a request
     *
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request)
    {
        list($request, $response) = $this->getMiddleware()->handle($request);

        if (null !== $response) {
            return $response;
        }

        return $response;
    }

    /**
     * Runs the application.
     *
     * @param ServerRequestInterface $request
     *
     * @return void
     */
    public function run(ServerRequestInterface $request = null)
    {
        $request = $request ?: ServerRequestFactory::fromGlobals();

        $this->boot();
        $response = $this->handle($request);

        $this->emitter->emit($response);
    }

    /**
     * Adds a middleware.
     *
     * @param MiddlewareInterface $middleware
     *
     * @return void
     */
    public function middleware(MiddlewareInterface $middleware)
    {
        $this->getMiddleware()->add($middleware);
    }

    /**
     * registerEvents
     *
     * @return void
     */
    protected function registerEvents()
    {
        $func = require dirname(__DIR__).'/config/events.php';
        $func($this->container, $this->container->get('events'));
    }

    /**
     * getMiddleware
     *
     * @return App\Middleware\Stack
     */
    protected function getMiddleware()
    {
        if (null === $this->middleware) {
            $this->middleware = $this->container->get('kernel.middleware');
        }

        return $this->middleware;
    }
}
