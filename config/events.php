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
        $config = $container->get('config');
        $event->getEngine()->registerExtension($container->get('view.markdown'));
        $event->getEngine()->registerExtension(
            new App\Bridge\Template\UtilsExtension($config->get('view:icons', []))
        );
        $view->addListener('playground.php', new App\View\RenderAppSettingsListener($config));
    });
};
