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
use Lucid\Template\EngineInterface as View;

/**
 * @trait ViewControllerTrait
 *
 * @package App\Controller
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
trait ViewControllerTrait
{
    /** @var View */
    private $view;

    /**
     * renderResponse
     *
     * @param mixed $template
     * @param array $args
     * @param int $status
     * @param ResponseInterface $response
     *
     * @return ResponseInterface
     */
    private function renderResponse($template, array $args = [], $status = 200, ResponseInterface $response = null)
    {
        $resource = fopen('php://temp', 'bw+');
        fwrite($resource, $this->getView()->render($template, $args));
        $stream = new Stream($resource);

        if (null !== $response) {
            $response = $response->withBody($stream);
            if ($status !== $response->getStatusCode()) {
                $response = $response->withStatusCode($status);
            }
        } else {
            $response = new Response($stream, $status);
        }

        return $response;
    }

    /**
     * setView
     *
     * @param View $view
     *
     * @return void
     */
    private function setView(View $view)
    {
        $this->view = $view;
    }

    /**
     * getView
     *
     * @return View
     */
    private function getView()
    {
        return $this->view;
    }
}
