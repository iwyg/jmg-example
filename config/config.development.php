<?php

return [
    'templates' => [
        realpath(__DIR__.'/../resources/templates')
    ],

    'markdown' => realpath(__DIR__.'/../resources/markdown'),
    'storage'  => realpath(__DIR__.'/../storage'),

    'images.path' => dirname(__DIR__).'/resources/images',
    'image_resolve.path' => dirname(__DIR__).'/resources/images',

    'jmg.paths' => [
        'images' => dirname(__DIR__).'/resources/images',
        'assets' => publicPath().'/assets',
    ],
    'jmg.loaders' => [
        'images' => new Thapp\Jmg\Loader\FilesystemLoader,
        'assets' => 'images'
    ],
    'jmg.cache_prefix' => 'cached',
    'jmg.caches' => [
        'images' => new Thapp\Jmg\Cache\FilesystemCache(dirname(__DIR__).'/resources/cache/images'),
        'assets' => 'images'
    ],
    'jmg.mode_constraints' => [
         1   => [2400, 2400],  // max width and height 2400px
         2   => [2400, 2400],  // max width and height 2400px
         3   => [2400, 2400],  // max width and height 2400px
         4   => [2400, 2400],  // max width and height 2400px
         5   => [200],         // max scaling 200%
         6   => [4000000],     // max pixel count 4000000
     ],
     'jmg.recipes' => [
         'hero_lrg' => ['assets', '2/2400/1200/5'],
         'hero_med' => ['assets', '2/1800/900/5'],
         'hero_sml' => ['assets', '2/1200/600/5'],
         'hero_tny' => ['assets', '2/800/400/5'],
     ],
     'jmg.image.options' => [
         'compression' => 80
     ]
];
