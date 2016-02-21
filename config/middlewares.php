<?php

$app->middleware($container->get('middleware.content_type'));
$app->middleware($container->get('middleware.xhr_request'));
