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

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * @class TrailingSlash
 *
 * @package App\Middleware
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class TrailingSlash implements MiddlewareInterface
{
    public function handle(Request $request, Response $response = null)
    {
        $url = $request->getUri();
        $path = $url->getPath();

        if ('/' !== $path) {
            $request = $request->withUri($url->withPath(rtrim($path, '/')), true);
        }

        return [$request, $response];
    }
}
