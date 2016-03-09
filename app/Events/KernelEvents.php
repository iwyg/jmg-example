<?php

/*
 * This File is part of the App\Events package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Events;

/**
 * @class KernelEvents
 *
 * @package App\Events
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
final class KernelEvents
{
    const MIDDLEWARE    = 'kernel.middleware';
    const REQUEST_OK    = 'kernel.request_ok';
    const REQUEST_ERROR = 'kernel.request_exception';

    private function __construct()
    {
    }
}
