<?php

/*
 * This File is part of the App\Markdown\Post package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Markdown\Post;

use Lucid\Xml\Dom\DOMDocument;

/**
 * @interface ParserInterface
 *
 * @package App\Markdown\Post
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
interface ParserInterface
{
    public function parse(DOMDocument $dom);
}
