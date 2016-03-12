<?php

/*
 * This File is part of the App\Bridge\Template package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Bridge\Template;

use App\Markdown\RenderInterface;
use Lucid\Template\Extension\TemplateFunction;
use Lucid\Template\Extension\AbstractExtension;

/**
 * @class MarkdownExtension
 *
 * @package App\Bridge\Template
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class MarkdownExtension extends AbstractExtension
{
    private $md;
    public function __construct(RenderInterface $md)
    {
        $this->md = $md;
    }

    public function functions()
    {
        return [
            new TemplateFunction('markdown', [$this->md, 'render'], ['is_safe_html' => true]),
        ];
    }
}
