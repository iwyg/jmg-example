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
class IndexController extends PageController
{
    /**
     * {@inheritdoc}
     */
    public function __invoke(ServerRequestInterface $request, ResponseInterface $response = null)
    {
        return $this->renderResponse(
            'index.phpml',
            ['title' => 'JMG | Just in time image manipulation.'],
            200,
            $response
        );
    }
}
