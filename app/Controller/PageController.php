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
abstract class PageController
{
    protected $view;
    public function __construct($view)
    {
        $this->view = $view;
    }

    abstract public function __invoke(ServerRequestInterface $request, $response = null);

    protected function renderTemplate($template)
    {
        try {
            $rendered = $this->view->render($template);
        } catch (\Exception $e) {
            return $this->error($e);
        }

        return $this->getTemplateResponse($rendered);
    }

    protected function error(\Exception $e)
    {
        $resource = fopen('php://temp', 'bw+');
        fwrite($resource, $e->getMessage());

        return new Response($resource, 500);
    }

    protected function getTemplateResponse($rendered)
    {
        $resource = fopen('php://temp', 'bw+');
        fwrite($resource, $rendered);

        return new Response(new Stream($resource));
    }
}
