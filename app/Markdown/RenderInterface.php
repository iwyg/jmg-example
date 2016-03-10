<?php

/*
 * This File is part of the App\Mardown package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Markdown;

/**
 * @interface RenderInterface
 *
 * @package App\Mardown
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
interface RenderInterface
{
    /**
     * Renders a markdown resource.
     *
     * @param string $markdown
     *
     * @return string
     */
    public function render($markdown);
}
