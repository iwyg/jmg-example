<?php

/*
 * The image processor
 */
$container['jmg.proc'] = $container->share(function () use ($container) {
    if (extension_loaded('imagick')) {
        return new Thapp\Jmg\Image\Processor(new Thapp\Image\Driver\Imagick\Source);
    }
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
$container['jmg.path_resolver'] = $container->share(function () use ($container) {
    return new Thapp\Jmg\Resolver\PathResolver(
        $container['config']['jmg.paths']
    );
});

/*
 * The loader resolver
 */
$container['jmg.cache_resolver'] = $container->share(function () use ($container) {
    return new Thapp\Jmg\Resolver\CacheResolver($container['config']['jmg.caches']);
});

$container['jmg.recipe_resolver'] = $container->share(function () use ($container) {
    return new Thapp\Jmg\Resolver\RecipeResolver;
});

/*
 * The image resolver
 */
$container['jmg.image_resolver'] = $container->share(function () use ($container) {
    $paths = $container->get('jmg.path_resolver');
    $loaderResolver = $container['jmg.loader_resolver'];
    $cacheResolver = $container['jmg.cache_resolver'];
    $validator = new Thapp\Jmg\Validator\ModeConstraints(
        $container['config']['jmg.mode_constraints']
    );

    foreach ($container['config']['jmg.loaders'] as $alias => $loader) {
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
    return new App\Controller\JmgController($container['jmg.image_resolver']);
});
