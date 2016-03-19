<?php

use Thapp\Jmg\ProcessorInterface as Proc;

return [
    'templates' => [
        realpath(__DIR__.'/../resources/templates')
    ],
    'view' => [
        'icons' => [
            'link'    => '../../public/src/icons/ic_link_black_48px.svg',
            'install' => '../../public/src/icons/ic_system_update_alt_black_48px.svg',
            'grid'    => '../../public/src/icons/ic_dashboard_black_48px.svg'
        ]
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
        Proc::IM_RESIZE       => [2400, 2400],  // max width and height 2400px
        Proc::IM_SCALECROP    => [2400, 2400],  // max width and height 2400px
        Proc::IM_CROP         => [2400, 2400],  // max width and height 2400px
        Proc::IM_RSIZEFIT     => [2400, 2400],  // max width and height 2400px
        Proc::IM_RSIZEPERCENT => [200],         // max scaling 200%
        Proc::IM_RSIZEPXCOUNT => [4000000],     // max pixel count 4000000
    ],

    'jmg.recipes' => [
        'hero_lrg'  => ['assets', '2/2400/1200/5'],
        'hero_med'  => ['assets', '2/1800/900/5'],
        'hero_sml'  => ['assets', '2/1200/600/5'],
        'hero_xsml' => ['assets', '2/800/400/5'],
    ],

    'jmg.image.options' => [
        'compression' => 80
    ],

    /*
     * Min value settings for playgournd app
     */
    'playground' => [
        'minW'     => 100,
        'minH'     => 100,
        'minPx'    => 1000,
        'minScale' => 10,
    ]
];
