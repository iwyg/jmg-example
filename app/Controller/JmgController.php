<?php

/*
 * This File is part of the App\Controller package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Controller;

use Zend\Diactoros\Response;
use Zend\Diactoros\Response\JsonResponse;
use Thapp\Jmg\Parameters;
use Thapp\Jmg\Http\Psr7\ResponseFactory;
use Psr\Http\Message\ServerRequestInterface;

/**
 * @class JmgController
 *
 * @package App\Controller
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class JmgController
{
    public function __construct($imageResolver)
    {
        $this->imageResolver = $imageResolver;
        $this->responseFactory = new ResponseFactory;
    }

    public function imageCachedAction(ServerRequestInterface $request)
    {
        $alias = $request->getAttribute('alias');
        $id = $request->getAttribute('id');
        $ext = $request->getAttribute('ext');

        if (!$resource = $this->imageResolver->resolveCached($alias, $id.$ext)) {

        }

        return $this->responseFactory->getResponse($request, $resource);
    }

    public function imageQueryAction(ServerRequestInterface $request)
    {
        $params = Parameters::fromQuery($request->getQueryParams());

        if (!$resource = $this->imageResolver->resolve(
            $request->getAttribute('src'),
            $params,
            null,
            $request->getAttribute('alias')
        )) {
            return new Response('php://temp', 404);
        }

        return $this->responseFactory->getResponse($request, $resource);
    }
}
