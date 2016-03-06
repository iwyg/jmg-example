<?php

return [
    'templates' => [
        realpath(__DIR__.'/../resources/templates')
    ],
    'storage'  => realpath(__DIR__.'/../storage'),

    'images.path' => dirname(__DIR__).'/resources/images',
    'image_resolve.path' => dirname(__DIR__).'/resources/images',

    'jmg.paths' => [
        'images' => dirname(__DIR__).'/resources/images'
    ],
    'jmg.loaders' => [
        'images' => new Thapp\Jmg\Loader\FilesystemLoader
    ],
    'jmg.cache_prefix' => 'cached',
    'jmg.caches' => [
        'images' => new Thapp\Jmg\Cache\FilesystemCache(dirname(__DIR__).'/resources/cache/media/q/images')
        //'media/q/images' => new Thapp\Jmg\Cache\FilesystemCache(publicPath() . '/cached/media/q/images')
    ],
    'jmg.mode_constraints' => [
         1   => [2000, 2000],  // max width and height 2000px
         2   => [2000, 2000],  // max width and height 2000px
         3   => [2000, 2000],  // max width and height 2000px
         4   => [2000, 2000],  // max width and height 2000px
         5   => [200],         // max scaling 200%
         6   => [4000000],     // max pixel count 4000000
    ]
];
