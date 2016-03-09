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

use Thapp\Jmg\ParamGroup;
use Zend\Diactoros\Response;
use Thapp\Jmg\Http\Psr7\ResponseFactory;
use Psr\Http\Message\ServerRequestInterface;
use Thapp\Jmg\Resolver\ImageResolverInterface;

/**
 * @class JmgController
 *
 * @package App\Controller
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class JmgController
{
    /**
     * Constructor.
     *
     * @param ImageResolverInterface $imageResolver
     */
    public function __construct(ImageResolverInterface $imageResolver)
    {
        $this->imageResolver = $imageResolver;
        $this->responseFactory = new ResponseFactory;
    }

    /**
     * Resolves an image query.
     *
     * @param ServerRequestInterface $request
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function imageQueryAction(ServerRequestInterface $request)
    {
        $query = $request->getQueryParams();
        $src   = $request->getAttribute('src');
        $alias = $request->getAttribute('alias');

        if (isset($query['jmg'])) {
            $resource = $this->chainedQueryAction($src, $alias, $query);
        } else {
            $resource = $this->singleQueryAction($src, $alias, $query);
        }

        if (!$resource) {
            return $this->resourceNotFound($request);
        }

        return $this->responseFactory->getResponse($request, $resource);
    }

    /**
     * Resolves a cached image resource.
     *
     * @param ServerRequestInterface $request
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function imageCachedAction(ServerRequestInterface $request)
    {
        $alias = $request->getAttribute('alias');
        $id    = $request->getAttribute('id');
        $ext   = $request->getAttribute('ext');

        if (!$resource = $this->imageResolver->resolveCached($alias, $id.$ext)) {
            return $this->resourceNotFound();
        }

        return $this->responseFactory->getResponse($request, $resource);
    }

    /**
     * Resolves a chained query action with `mode` key.
     *
     * @param string $src
     * @param string $alias
     * @param array $query
     *
     * @return Thapp\Jmg\Resource\ImageResourceInterface
     */
    private function queryAction($src, $alias, array $query)
    {
        $params = ParamGroup::fromQuery($query);
        var_dump($params);
        die;

        return $this->imageResolver->resolve($src, $params, $alias);
    }

    private function resourceNotFound()
    {
        return new Response('php://temp', 404);
    }
}
