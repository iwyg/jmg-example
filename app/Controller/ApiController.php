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
use App\Model\ImageRepository;
use App\Exception\NoResultException;
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
    /** @var int */
    private $limit;

    /** @var ImageRepository */
    private $repository;

    /**
     * Constructor.
     *
     * @param ImageRepository $repository
     * @param int $limit
     */
    public function __construct(ImageRepository $repository, $limit = 100)
    {
        $this->repository = $repository;
        $this->limit = $limit;
    }

    /**
     * Handles api request.
     *
     * @param Response $response
     *
     * @return Response
     */
    public function __invoke(Request $request, Response $response = null)
    {
        $query  = $request->getQueryParams();

        $params = ParamGroup::fromQuery($query);
        $limit  = isset($q['limit']) ? max(1, min($this->limit, (int)$q['limit'])) : $this->limit;

        list ($response, $status) = $this->createPayloadArray($request, $params, $limit);
        return $this->response($request, $response, $status);
    }

    /**
     * handleErr
     *
     * @param Request $request
     * @param Response $response
     *
     * @return Response
     */
    public function handleErr(Request $request, Response $response = null)
    {
        return new JsonResponse(['error' => $response ? $response->getBody() : 'unkown err'], 500);
    }

    private function createPayloadArray(Request $request, ParamGroup $params, $limit)
    {
        $src   = urldecode($request->getAttribute('src'));
        $alias = urldecode($request->getAttribute('alias'));

        if (empty($src)) {
            $src = null;
        }

        try {
            return [['images' => $this->repository->fetch($alias, $params, $src, $limit, true)], 200];
        } catch (NoResultException $e) {
            return [['error' => $e->getMessage()], 404];
        } catch (\Exception $e) {
            return [['error' => $e->getMessage()], 500];
        }
    }

    private function response(Request $request, $response = [], $status = 200)
    {
        return new JsonResponse($response, $status);
    }
}
