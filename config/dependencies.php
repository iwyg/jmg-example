<?php


use Lucid\Mux\Router;
use Lucid\Resource\Locator;
use Lucid\Mux\Loader\PhpLoader;
use Lucid\Mux\Handler\Dispatcher;

/*
 * ---------------------------------------------------
 * Controller
 * ---------------------------------------------------
 */
$container['config'] = $container->share(function () use ($container) {
    $config = new App\Config\Config(__DIR__);
    $config->load(['config.default.php', 'config.php']);

    return $config;
});

/*
 * ---------------------------------------------------
 * Controller
 * ---------------------------------------------------
 */
$container['ctrl.index'] = $container->share(function () use ($container) {
    return new App\Controller\IndexController($container['view']);
});

$container['ctrl.playground'] = $container->share(function () use ($container) {
    return new App\Controller\PlaygroundController($container['view']);
});

$container['ctrl.api'] = $container->share(function () use ($container) {
    return new App\Controller\ApiController($container->get('image_repo'));
});

$container['ctrl.error'] = $container->share(function () use ($container) {
    return new App\Controller\ErrorController(
        $container->get('view')
    );
});

/*
 * ---------------------------------------------------
 * View
 * ---------------------------------------------------
 */
$container['view'] = $container->share(function () use ($container) {
    $paths = (array)$container['config']['templates'];
    $engine = new Lucid\Template\Engine(new Lucid\Template\Loader\FilesystemLoader($paths));
    $view = new Lucid\Template\View($engine);

    $container->get('events')->dispatch('view.register', new App\Events\RegisterView($view, $engine));

    return $view;
});

$container['view.markdown'] = $container->share(function () use ($container) {
    return new App\Bridge\Template\MarkdownExtension($container->get('markdown.render'));
});

$container['markdown.render'] = $container->share(function () use ($container) {
    return new App\Markdown\Renderer(
        $container->get('markdown.adapter'),
        $container->get('markdown.loader'),
        $container->get('markdown.cache')
    );
});

$container['markdown.adapter'] = $container->share(function () use ($container) {
    return new App\Markdown\Adapter\Cebe(new cebe\markdown\GithubMarkdown);
});

$container['markdown.loader'] = $container->share(function () use ($container) {
    return new App\Markdown\Loader\Filesystem($container['config']['markdown']);
});

$container['markdown.cache'] = $container->share(function () use ($container) {
    return new App\Markdown\Cache\Filesystem($container['config']['storage'].'/markdown');
});

$container['router.response_mapper'] = $container->share(function () use ($container) {
});

/*
 * ---------------------------------------------------
 * Model
 * ---------------------------------------------------
 */
$container['image_repo'] = $container->share(function () use ($container) {
    return new App\Model\ImageRepository(
        $container->get('jmg.api'),
        $container->get('jmg.path_resolver')
    );
});

/*
 * ---------------------------------------------------
 * Routing
 * ---------------------------------------------------
 */
$container['router.handler.mapped_types'] = $container->share(function () use ($container) {
    return new Lucid\Mux\Handler\TypeMapCollection([
        new App\Bridge\Mux\TypeMap($container, 'request', 'Psr\Http\Message\ServerRequestInterface'),
        new App\Bridge\Mux\TypeMap($container, 'response', 'Psr\Http\Message\ResponseInterface'),
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

    $container['routes'] = $routes = $cacheLoader->load($loader, true);

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

/*
 * ---------------------------------------------------
 * Events
 * ---------------------------------------------------
 */
$container['events'] = $container->share(function () use ($container) {
    return new Lucid\Signal\ContainerAwareDispatcher($container);
});

/*
 * ---------------------------------------------------
 * Middleware
 * ---------------------------------------------------
 */
$container['kernel.middleware'] = $container->share(function () use ($container) {
    return new App\Middleware\Queue($container->get('events'), 'kernel.middleware');
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
