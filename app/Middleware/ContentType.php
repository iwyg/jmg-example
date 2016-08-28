<?php

/*
 * This File is part of the App\Middleware package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Middleware;

use Negotiation\Negotiator;
use App\Events\ContentTypeEvent;
use Lucid\Signal\EventDispatcherInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Lucid\Infuse\MiddlewareInterface;
/**
 * @class RequestType
 *
 * @package App\Middleware
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class ContentType implements MiddlewareInterface
{
    /** @var EventDispatcherInterface  */
    private $events;

    /** @var Negotiator  */
    private $negotiator;

    /**
     * ContentType constructor.
     * @param Negotiator $negotiator
     * @param EventDispatcherInterface $events
     */
    public function __construct(Negotiator $negotiator, EventDispatcherInterface $events)
    {
        $this->events = $events;
        $this->negotiator = $negotiator;
    }

    /**
     * Dispatches an event.
     * {@inheritdoc}
     */
    public function handle(Request $request, Response $response)
    {
        $this->events->dispatch(
            'accept.content_type',
            new ContentTypeEvent($this->negotiator, $request->getHeaderLine('accept'))
        );

        return [$request, $response];
    }
}
