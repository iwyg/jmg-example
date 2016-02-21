<?php


use Lucid\Mux\Router;
use Lucid\Resource\Locator;
use Lucid\Mux\Loader\PhpLoader;
use Lucid\Mux\Handler\Dispatcher;

$container['config'] = require __DIR__.'/config.php';

$container['ctrl.index'] = $container->share(function () use ($container) {
    return new App\Controller\IndexController($container['view']);
});

$container['ctrl.gutter'] = $container->share(function () use ($container) {
    return new App\Controller\GutterController($container['view']);
});

$container['ctrl.api'] = $container->share(function () use ($container) {
    return new App\Controller\ApiController($container->get('image_repo'));
});

$container['image_repo'] = $container->share(function () use ($container) {
    return new App\Model\ImageRepository(
        $container->get('jmg.api'),
        $container->get('jmg.path_resolver')
    );
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


$container['routes'] = null;
$container['router'] = $container->share(function () use ($container) {
    $loader = new PhpLoader(new Locator([__DIR__]));
    $routes = $loader->loadRoutes('routes.php');
    $container['routes'] = $routes;

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

$container['events'] = $container->share(function () use ($container) {
    return new Lucid\Signal\ContainerAwareDispatcher($container);
});

$container['negotiation'] = $container->share(function () use ($container) {
    return new Negotiation\Negotiator;
});

$container['middleware.xhr_request'] = $container->share(function () use ($container) {
    return new App\Middleware\XhrRequest($container->get('events'));
});

$container['middleware.content_type'] = $container->share(function () use ($container) {
    return new App\Middleware\ContentType($container->get('negotiation'), $container->get('events'));
});

require __DIR__.'/jmg.php';

//$src = $container->get('jmg.jmg')->take('image_0001.jpg', 'media/q/images', false)->get();
//var_dump($src);
//die;
