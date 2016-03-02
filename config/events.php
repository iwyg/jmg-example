<?php

use App\Events\RequestEvent;

return function (Interop\Container\ContainerInterface $container, Lucid\Signal\EventDispatcherInterface $events) {

    $events->addHandler('kernel.response', function ($e) {
        $response = $e->getResponse();
    });

    $events->addHandler('kernel.middleware', function (RequestEvent $event) use ($container) {
        $container['request'] = $event->getRequest();
        $container['response'] = $event->getResponse();
    });
};
