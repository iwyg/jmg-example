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

use Interop\Container\ContainerInterface;
use Zend\Diactoros\ServerRequestFactory;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Lucid\Mux\Request\Context as RequestContext;

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

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->emitter = new \Zend\Diactoros\Response\SapiEmitter;
    }

    public function handle(ServerRequestInterface $request)
    {
        $this->container['request'] = $request;
        $match = $this->container['router']->match($rc = RequestContext::fromPsrRequest($request));


        if (!$match->isMatch()) {
            return;
        }

        foreach ($match->getVars() as $key => $value) {
            $request = $request->withAttribute($key, $value);
        }

        $this->container['request'] = $request;

        $response = $this->container['router']->dispatchMatch($match);

        $this->emitter->emit($response);
    }

    public function run()
    {
        $request = ServerRequestFactory::fromGlobals();

        return $this->handle($request);
    }
}
