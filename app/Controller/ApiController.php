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
        $params = Parameters::fromQuery($q = $request->getQueryParams());
        $filter = FilterExpression::fromQuery($q);
        $limit  = isset($q['limit']) ? max(1, min(30, (int)$q['limit'])) : 20;

        return $this->response($request, $this->createPayloadArray($request, $params, $filter, $limit));
    }

    public function triggerError(Request $request)
    {
        return $this->response($request, ['error' => 500], 500);
    }

    private function createPayloadArray(Request $request, Parameters $params, FilterExpression $filter, $limit)
    {
        list($src, $alias) = [null, null];
        extract($request->getAttributes(), EXTR_IF_EXISTS);

        if (empty($src)) {
            $src = null;
        }

        $filter = 0 === count($filter->all()) ? null : $filter;

        return ['images' => $this->repository->fetch($alias, $params, $filter, $src, $limit, true)];
    }

    private function response(Request $request, $response = [], $status = 200)
    {
        return new JsonResponse($response, $status);
    }
}
