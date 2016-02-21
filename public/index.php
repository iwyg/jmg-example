<?php
if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $file = __DIR__ . $_SERVER['REQUEST_URI'];
    if (is_file($file)) {
        return false;
    }
}

set_error_handler(function ($errno, $errmsg, $errfile, $lino) {
    throw new \ErrorException($errmsg, $errno, 1, $errfile, $lino);
});

//session_start();

$app = require __DIR__ . '/../config/bootstrap.php';
//
$app->run();
