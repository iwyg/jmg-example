<?php

/*
 * This File is part of the App\Events package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Events;

use Lucid\Signal\Event;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * @class RequestEvent
 *
 * @package App\Events
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class RequestEvent extends Event
{
    /** @var Psr\Http\Message\ServerRequestInterface */
    private $request;

    /** @var Psr\Http\Message\ResponseInterface */
    private $response;

    /**
     * Constructor.
     *
     * @param Request $request
     * @param Response $response
     */
    public function __construct(Request $request, Response $response = null)
    {
        $this->request  = $request;
        $this->response = $response;
    }

    /**
     * Get the current Request
     *
     * @return Psr\Http\Message\ServerRequestInterface
     */
    public function getRequest()
    {
        return $this->request;
    }

    /**
     * Get the current resopnse,
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function getResponse()
    {
        return $this->response;
    }

    /**
     * Set the current request.
     *
     * @param Psr\Http\Message\ServerRequestInterface $request
     *
     * @return void
     */
    public function setRequest(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Set the current response
     *
     * @param Psr\Http\Message\ResponseInterface $resonse
     *
     * @return void
     */
    public function setResponse(Response $resonse)
    {
        $this->response = $response;
    }
}
