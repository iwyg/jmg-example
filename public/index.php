<?php

/*
 * This File is part of the Jmg/Example package
 *
 * (c)  Thomas Appel <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

if ('cli-server' === PHP_SAPI && is_file(__DIR__ . $_SERVER['REQUEST_URI'])) {
    return false;
}

set_error_handler(function ($errno, $errmsg, $errfile, $lino) {
    throw new \ErrorException($errmsg, $errno, 1, $errfile, $lino);
});

session_start();

$app = require __DIR__ . '/../config/bootstrap.php';
$app->run();
