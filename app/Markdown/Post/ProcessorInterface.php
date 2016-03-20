<?php

/*
 * This File is part of the App\Markdown package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Markdown\Post;

use DOMDocument;

/**
 * @interface ProcessorInterface
 *
 * @package App\Markdown
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
interface ProcessorInterface
{
    public function load($parsed);

    public function process();
}
