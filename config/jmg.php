<?php

/*
 * The image processor
 */
$container['jmg.proc'] = $container->share(function () use ($container) {
    return new Thapp\Jmg\Image\Processor(new Thapp\Image\Driver\GD\Source);
});

/*
 * The loader resolver
 */
$container['jmg.loader_resolver'] = $container->share(function () use ($container) {
    return new Thapp\Jmg\Resolver\LoaderResolver;
});

/*
 * The loader resolver
 */
$container['jmg.cache_resolver'] = $container->share(function () use ($container) {
    return new Thapp\Jmg\Resolver\CacheResolver($container['config']['jmg.caches']);
});

/*
 * The image resolver
 */
$container['jmg.image_resolver'] = $container->share(function () use ($container) {
    $paths = new Thapp\Jmg\Resolver\PathResolver($container['config']['jmg.paths']);

    return new Thapp\Jmg\Resolver\ImageResolver(
        $container['jmg.proc'],
        $paths,
        $container['jmg.loader_resolver']
    );

});

$container['jmg.view'] = $container->share(function () use ($container) {
});


/*
 * The image controller
 */
$container['ctrl.jmg'] = $container->share(function () use ($container) {
    return new App\Controller\JmgController($container['jmg.image_resolver']);
});
