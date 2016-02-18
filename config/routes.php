<?php

return [
    'index' => [
        'pattern' => '/',
        'methods' => ['GET'],
        'handler' => 'ctrl.index'
    ],

    'imagequery' => [
        'pattern' => '/images/q/{src}',
        'methods' => ['GET'],
        'handler' => 'ctrl.jmg@imageQueryAction',
        'requirements' => [
            'src' => '.*\.(jpe?g|png)'
        ]
    ]
];
