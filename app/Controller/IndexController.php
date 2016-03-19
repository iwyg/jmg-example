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

/**
 * @class IndexController
 *
 * @package App\Controller
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class IndexController
{
    public function __construct($view)
    {
        $this->view = $view;
    }

    public function __invoke()
    {
        return $this->renderTemplate('index.phpml');
    }

    protected function renderTemplate($template)
    {
        $resource = fopen('php://temp', 'bw+');
        fwrite($resource, $this->view->render($template));

        return new Response(new Stream($resource));
    }
}
