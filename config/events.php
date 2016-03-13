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

    $events->addHandler('view.register', function ($event) use ($container) {
        $view = $event->getView();
        $event->getEngine()->registerExtension($container->get('view.markdown'));
        $view->addListener('playground.php', new App\View\RenderAppSettingsListener($container->get('config')));
    });
};
