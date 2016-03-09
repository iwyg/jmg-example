<?php

/*
 * This File is part of the App\EventHandler package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\EventHandler;

use Negotiation\Negotiator;
use App\Events\RequestEvent;
use App\Events\RequestExceptionEvent;
use Lucid\Signal\EventDispatcherInterface;
use Lucid\Signal\EventInterface;
use Lucid\Signal\HandlerInterface;
use Zend\Diactoros\Response;
use Zend\Diactoros\Response\JsonResponse;
use Zend\Diactoros\Response\TextResponse;

/**
 * @class MiddlewareListener
 *
 * @package App\EventHandler
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class KernelResponse implements HandlerInterface
{
    public function __construct(EventDispatcherInterface $events, Negotiator $content)
    {
        $this->events = $events;
        $this->content = $content;
    }

    /**
     * {@inheritdoc}
     */
    public function handleEvent(EventInterface $event)
    {
        if ($event instanceof RequestExceptionEvent) {
            $event->setResponse($this->getErrorResponse($event));
        }
    }

    private function getErrorResponse(RequestExceptionEvent $event)
    {
        if (null !== $response = $event->getResponse()) {
            $response = $response->withStatusCode(500, 'Internal Server Error.');
        }

        $e = $event->getException();
        ob_start();
        throw $e;
        $c = ob_get_contents();
        ob_end_clean();

        $handle = fopen('php://temp', 'wb+');
        fwrite($handle, $c);
        rewind($handle);

        return new Response($handle, 500);
    }
}
