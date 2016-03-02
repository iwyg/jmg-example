<?php

return [
    'index' => [
        'pattern' => '/',
        'methods' => ['GET'],
        'handler' => 'ctrl.index'
    ],

    'playground' => [
        'pattern' => '/playground',
        'methods' => ['GET'],
        'handler' => 'ctrl.playground'
    ],

    'api' => [
        'pattern' => '/api/v1',
        [
            'mediaq' => [
                'methods' => ['GET'],
                'pattern' => '/{alias}/{src?}',
                'handler' => 'ctrl.api@actionIndex',
                'requirements' => [
                    'alias' => '(media)(/{1}[qp]?)/(images|thumbs)',
                    'src' => '.*\.(jpe?g|png|gif)'
                ]
            ],

            'error' => [
                'methods' => ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD'],
                'pattern' => '/error',
                'handler' => 'ctrl.api@triggerError',
            ]
        ]

    ],

    'media.cached' => [
        'pattern' => '/cached/{alias}/{id}{ext?}',
        'methods' => ['GET'],
        'handler' => 'ctrl.jmg@imageCachedAction',
        'requirements' => [
            'alias' => '(media)(/{1}[qp]?)/(images|thumbs)',
            'id' => '[0-9A-Fa-f]{8}/(\w+)_?[0-9A-Fa-f]{18}',
            'ext' => '\.(jpe?g|png|gif)'
        ]
    ],

    'imagequery' => [
        'pattern' => '/{alias}/{src}',
        'methods' => ['GET'],
        'handler' => 'ctrl.jmg@imageQueryAction',
        'requirements' => [
            'alias' => 'media/q/images',
            'src' => '.*\.(jpe?g|png|gif)'
        ]
    ]
];
