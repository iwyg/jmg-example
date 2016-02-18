<?php

$container = new Interop\Container\Pimple\PimpleInterop;

require __DIR__ . '/helper.php';
require __DIR__ . '/dependencies.php';

$app = new App\Kernel($container);

return $app;
