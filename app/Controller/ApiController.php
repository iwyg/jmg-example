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
use Zend\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * @class ApiController
 *
 * @package App\Controller
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class ApiController
{
    public function __construct($repository)
    {
        $this->repository = $repository;
    }

    public function actionIndex(Request $request)
    {
        $basePath = $request->getAttribute('basepath');

        $src = $request->getAttribute('src');
        $files = $this->repository->fetch(
            $request->getAttribute('alias'),
            Parameters::fromQuery($q = $request->getQueryParams()),
            null,
            0 !== mb_strlen($src) ? $src : null,
            10,
            true
        );

        //var_dump($basePath);
        //var_dump($request->getAttribute('alias'));
        //die;
        return $this->response(['basepath' => $basePath, 'images' => $files]);
    }

    private function response($response)
    {
        return new JsonResponse($response);
    }
}
