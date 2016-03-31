<?php

/*
 * This File is part of the App\Mardown\Adapter package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Markdown\Adapter;

/**
 * @interface AdapterInterface
 *
 * @package App\Mardown\Adapter
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
interface AdapterInterface
{
    /**
     * Parses a markdown string.
     *
     * @param string $markdown
     *
     * @return string
     */
    public function parse($markdown);
}
