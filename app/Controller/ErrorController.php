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

use Lucid\Template\EngineInterface as View;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * @class ErrorController
 *
 * @package App\Controller
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class ErrorController
{
    use ViewControllerTrait;

    public function __construct(View $view)
    {
        $this->setView($view);
    }

    public function __invoke(Request $request, ResponseInterface $response = null)
    {
        $code = $request->getAttribute('code');
        return $this->renderResponse('error.php', compact('code'), $code, $response);
    }
}
