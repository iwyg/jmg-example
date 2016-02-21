<?php

return [
    'templates' => [
        realpath(__DIR__.'/../resources/templates')
    ],

    'images.path' => dirname(__DIR__).'/resources/images',
    'image_resolve.path' => dirname(__DIR__).'/resources/images',

    'jmg.paths' => [
        'media/q/images' => dirname(__DIR__).'/resources/images'
    ],
    'jmg.loaders' => [
        'media/q/images' => new Thapp\Jmg\Loader\FilesystemLoader
    ],
    'jmg.cache_prefix' => 'cached',
    'jmg.caches' => [
        'media/q/images' => new Thapp\Jmg\Cache\FilesystemCache(publicPath() . '/images/cached')
    ]
];
