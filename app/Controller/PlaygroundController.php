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

use Zend\Diactoros\Stream;
use Zend\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * @class IndexController
 *
 * @package App\Controller
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class PlaygroundController extends PageController
{
    public function __invoke(ServerRequestInterface $request, ResponseInterface $response = null)
    {
        return $this->renderResponse('playground.php', ['title' => 'JMG | Playground'], 200, $response);
    }
}
