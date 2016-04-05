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

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * @class DocsController
 *
 * @package App\Controller
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class DocsController extends PageController
{
    /**
     * {@inheritdoc}
     */
    public function __invoke(ServerRequestInterface $request, ResponseInterface $response = null)
    {
        return $this->actionAny($request->getAttributes(), $response);
    }

    private function actionAny(array $attrs, ResponseInterface $response = null)
    {
        return $this->renderResponse(
            'docs.phpml',
            array_merge($attrs, ['title' => 'JMG | Documentation']),
            200,
            $response
        );
    }
}
