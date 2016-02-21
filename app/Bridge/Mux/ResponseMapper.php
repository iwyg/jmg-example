<?php

/*
 * This File is part of the App\Bridge\Mux package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Bridge\Mux;

use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\ResponseInterface;
use Zend\Diactoros\Response;
use Zend\Diactoros\Response\TextResponse;
use Lucid\Mux\Request\ResponseMapperInterface;
use Interop\Container\ContainerInterface;

/**
 * @class ResponseMapper
 *
 * @package App\Bridge\Mux
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class ResponseMapper implements ResponseMapperInterface
{
    private $key;
    private $container;

    public function __construct(ContainerInterface $container, $key = 'request')
    {
        $this->container = $container;
        $this->key = $key;
    }

    public function mapResponse($response)
    {
        if ($response instanceof ResponseInterface) {
            return $response;
        }

        try {
            $this->deterMineResponseType($response);
        } catch (\InvalidArgumentException $e) {
            return null;
        }
    }

    private function deterMineResponseType($response)
    {
        $response = $this->getResponse($response);

        if (!$request = $this->container->get($this->key)) {
            return $response;
        }

        return $response;
    }

    private function getResponse($response)
    {
        if (is_array($response) || is_object($response)) {
            return new JsonResponse($respobse);
        }

        if (is_scalar($response) || is_string($response) && !is_file($response)) {
            return new TextResponse($response);
        }

        return new Response($response);

    }
}
