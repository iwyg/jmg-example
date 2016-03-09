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

use Thapp\Jmg\ParamGroup;
use Thapp\Jmg\FilterExpression;
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
        $query  = $request->getQueryParams();

        $params = ParamGroup::fromQuery($query);
        $limit  = isset($q['limit']) ? max(1, min(100, (int)$q['limit'])) : 20;

        list ($response, $status) = $this->createPayloadArray($request, $params, $limit);
        return $this->response($request, $response, $status);
    }

    private function createPayloadArray(Request $request, ParamGroup $params, $limit)
    {
        list($src, $alias) = [null, null];
        extract($request->getAttributes(), EXTR_IF_EXISTS);

        if (empty($src)) {
            $src = null;
        }

        try {
            return [['images' => $this->repository->fetch($alias, $params, $src, $limit, true)], 200];
        } catch (\Exception $e) {
            return [['error' => $e->getMessage(), 500]];
        }
    }

    private function response(Request $request, $response = [], $status = 200)
    {
        return new JsonResponse($response, $status);
    }
}
