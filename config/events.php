<?php

$events = $container->get('events');
//
//$events->addHandler('accept.content_type', function ($event) {
//    $contentType = $event->accepts(['text/html']);
//});
//
//$events->addHandler('request.xhr', function ($e) {
//});
//
$events->addHandler('kernel.response', function ($e) {
    $response = $e->getResponse();
});
