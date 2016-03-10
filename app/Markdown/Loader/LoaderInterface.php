<?php

/*
 * This File is part of the App\Markdown\Loader package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Markdown\Loader;

/**
 * @interface LoaderInterface
 *
 * @package App\Markdown\Loader
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
interface LoaderInterface
{
    public function load($markdown);
}
