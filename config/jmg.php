<?php

/*
 * The image processor
 */
$container['jmg.proc'] = $container->share(function () use ($container) {
    if (extension_loaded('imagick')) {
        $proc = new Thapp\Jmg\Image\Processor(new Thapp\Image\Driver\Imagick\Source);
    } else {
        $proc = new Thapp\Jmg\Image\Processor(new Thapp\Image\Driver\GD\Source);
    }

    $proc->setOptions($container['config']['jmg.image.options']);

    return $proc;
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
$container['jmg.path_resolver'] = $container->share(function () use ($container) {
    return new Thapp\Jmg\Resolver\PathResolver(
        $container['config']['jmg.paths']
    );
});

/*
 * The loader resolver
 */
$container['jmg.cache_resolver'] = $container->share(function () use ($container) {
    $config = $container['config']['jmg.caches'];
    $caches = [];
    foreach ($config as $alias => $cache) {
        if (is_string($cache) && isset($config[$cache])) {
            $cache = $config[$cache];
        }

        $caches[$alias] = $cache;
    }

    return new Thapp\Jmg\Resolver\CacheResolver($caches);
});

$container['jmg.recipe_resolver'] = $container->share(function () use ($container) {
    return new Thapp\Jmg\Resolver\RecipeResolver($container['config']['jmg.recipes']);
});

/*
 * The image resolver
 */
$container['jmg.image_resolver'] = $container->share(function () use ($container) {
    $paths = $container->get('jmg.path_resolver');
    $config = $container->get('config');
    $loaderResolver = $container['jmg.loader_resolver'];
    $cacheResolver = $container['jmg.cache_resolver'];
    $validator = new Thapp\Jmg\Validator\ModeConstraints(
        $container['config']['jmg.mode_constraints']
    );

    $loaders = $config['jmg.loaders'];

    foreach ($loaders as $alias => $loader) {
        if (is_string($loader) && isset($loaders[$loader])) {
            $loader = $loaders[$loader];
        }

        $loaderResolver->add($alias, $loader);
    }

    return new Thapp\Jmg\Resolver\ImageResolver(
        $container['jmg.proc'],
        $paths,
        $loaderResolver,
        $cacheResolver,
        $validator
    );

});

$container['jmg.uri'] = $container->share(function () use ($container) {
    return new Thapp\Jmg\Http\UrlBuilder();
});

$container['jmg.jmg'] = $container->share(function () use ($container) {
    return new Thapp\Jmg\View\Jmg(
        $container->get('jmg.image_resolver'),
        $container->get('jmg.recipe_resolver'),
        $container->get('jmg.uri'),
        $container['config']['jmg.cache_prefix']
    );
});

$container['jmg.api'] = $container->share(function () use ($container) {
    return new App\Api\Generator(
        $container->get('jmg.image_resolver'),
        $container->get('jmg.recipe_resolver'),
        $container->get('jmg.uri'),
        $container['config']['jmg.cache_prefix']
    );
});

/*
 * The image controller
 */
$container['ctrl.jmg'] = $container->share(function () use ($container) {
    return new App\Controller\JmgController(
        $container->get('jmg.image_resolver'),
        $container->get('jmg.recipe_resolver')
    );
});
