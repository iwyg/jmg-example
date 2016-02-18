<?php


use Lucid\Mux\Router;
use Lucid\Resource\Locator;
use Lucid\Mux\Loader\PhpLoader;
use Lucid\Mux\Handler\Dispatcher;

$container['config'] = require __DIR__.'/config.php';

$container['ctrl.index'] = $container->share(function () use ($container) {
    return new App\Controller\IndexController($container['view']);
});

$container['view'] = $container->share(function () use ($container) {
    $paths = (array)$container['config']['templates'];
    return new Lucid\Template\Engine(new Lucid\Template\Loader\FilesystemLoader($paths));
});

$container['router.response_mapper'] = $container->share(function () use ($container) {
});

$container['router.handler.mapped_types'] = $container->share(function () use ($container) {
    return new Lucid\Mux\Handler\TypeMapCollection([
        new App\Bridge\Mux\RequestTypeMap($container, 'request')
    ]);
});

$container['router'] = $container->share(function () use ($container) {
    $loader = new PhpLoader(new Locator([__DIR__]));
    $routes = $loader->loadRoutes('routes.php');

    return new Router(
        $routes,
        null,
        new Dispatcher(
            new Lucid\Mux\Handler\Resolver($container),
            new Lucid\Mux\Handler\StrictParameterMapper($container['router.handler.mapped_types'])
        ),
        new App\Bridge\Mux\ResponseMapper($container, 'request')
    );
});

require __DIR__.'/jmg.php';
