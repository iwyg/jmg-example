<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/helper.php';

$container = new Interop\Container\Pimple\PimpleInterop;

require __DIR__ . '/dependencies.php';

$app = new App\Kernel($container);

require __DIR__ . '/middlewares.php';

return $app;
