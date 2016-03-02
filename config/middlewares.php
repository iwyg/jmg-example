<?php

$app->middleware($container->get('middleware.mux'));
$app->middleware($container->get('middleware.content_type'));
$app->middleware($container->get('middleware.xhr_request'));
$app->middleware(new App\Middleware\TrailingSlash);
