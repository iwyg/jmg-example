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

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * @class RequestExceptionEvent
 *
 * @package App\Events
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class RequestExceptionEvent extends RequestEvent
{
    /** @var Exception */
    private $exception;

    /**
     * Constructor.
     *
     * @param \Exception $e
     * @param Request $request
     * @param Response $response
     */
    public function __construct(\Exception $e, Request $request, Response $response = null)
    {
        $this->exception = $e;
        parent::__construct($request, $response);
    }

    /**
     * getException
     *
     * @return \Exception
     */
    public function getException()
    {
        return $this->exception;
    }
}
