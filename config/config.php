<?php

return [
    'templates' => [
        __DIR__.'/../resources/templates'
    ],

    'jmg.paths' => [
        'images' => dirname(__DIR__).'/resources/images'
    ],
    'jmg.caches' => [
        'images' => publicPath() . '/images/cached'
    ]
];
