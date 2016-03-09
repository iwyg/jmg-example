<?php

use App\Events\KernelEvents;

return function (Interop\Container\ContainerInterface $container, Lucid\Signal\EventDispatcherInterface $events) {

    $setContainer = function ($key, $impl) use ($container) {
        return $container[$key] = $impl;
    };

    $events->addHandler(KernelEvents::MIDDLEWARE, new App\EventHandler\Middleware($setContainer));
    $events->addHandler(KernelEvents::REQUEST_ERROR, new App\EventHandler\KernelResponse(
        $events,
        $container['negotiation']
    ));
};
