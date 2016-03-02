<?php


use Lucid\Mux\Router;
use Lucid\Resource\Locator;
use Lucid\Mux\Loader\PhpLoader;
use Lucid\Mux\Handler\Dispatcher;

$container['config'] = require __DIR__.'/config.php';

$container['ctrl.index'] = $container->share(function () use ($container) {
    return new App\Controller\IndexController($container['view']);
});

$container['ctrl.playground'] = $container->share(function () use ($container) {
    return new App\Controller\PlaygroundController($container['view']);
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

$container['routes.cache_loader'] = $container->share(function () use ($container) {
    $storePath = $container['config']['storage'].'/routing';
    $storage = new Lucid\Mux\Cache\Storage\Filesystem($storePath);
    return new Lucid\Mux\Cache\CacheLoader(
        __DIR__.'/routes.php',
        $storage,
        $storePath,
        true
    );
});


$container['routes'] = null;
$container['routes.builder'] = $container->share(function () use ($container) {
    return new Lucid\Mux\RouteCollectionBuilder;

});

$container['routes.request_matcher'] = $container->share(function () use ($container) {
    $mapDumper = new Lucid\Mux\Cache\Matcher\Dumper;
    $storePath = $container['config']['storage'].'/routing';
    $mapLoader = new Lucid\Mux\Cache\Matcher\MapLoader($mapDumper, $storePath);

    return new Lucid\Mux\Cache\Matcher\FastMatcher($mapLoader);
});

$container['router'] = $container->share(function () use ($container) {
    $builder = $container['routes.builder'];
    $loader = new PhpLoader($builder, $locator = new Locator([__DIR__, '/']));
    $cacheLoader = $container['routes.cache_loader'];

    //var_dump($locator->locate(__DIR__.'/routes.php'));
    $container['routes'] = $routes = $cacheLoader->load($loader, true);

    //var_dump($routes);
    //die;
    //$routes = $loader->loadRoutes('routes.php');
    $matcher = $container->get('routes.request_matcher');

    return new Router(
        $routes,
        $matcher,
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

$container['middleware.mux'] = $container->share(function () use ($container) {
    return new App\Middleware\MuxMatch($container->get('router'), $container->get('events'));
});

require __DIR__.'/jmg.php';

//$src = $container->get('jmg.jmg')->take('image_0001.jpg', 'media/q/images', false)->get();
//var_dump($src);
//die;
