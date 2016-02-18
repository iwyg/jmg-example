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

use Thapp\Jmg\Parameters;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response\TextResponse;

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
    }

    public function imageQueryAction(ServerRequestInterface $request)
    {
        $params = $this->params($request->getQueryParams());

        if ($resource = $this->imageResolver->resolve($request->getAttribute('src'), $params)) {
            return $request->getAttribute('src');
        }
    }

    private function params(array $params)
    {
        if (!isset($params['mode'])) {
            $params['mode'] = 0;
        }

        if (6 === $params['mode'] && isset($params['pixel'])) {
            $params['width'] = $params['pixel'];
        } elseif (5 === $params['mode'] && isset($params['scale'])) {
            $params['width'] = $params['scale'];
        }

        return new Parameters($params);
    }
}
