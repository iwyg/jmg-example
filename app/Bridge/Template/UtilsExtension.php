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
use Lucid\Template\EngineInterface;
use Lucid\Template\Extension\TemplateFunction;
use Lucid\Template\Extension\AbstractExtension;

/**
 * @class MarkdownExtension
 *
 * @package App\Bridge\Template
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class UtilsExtension extends AbstractExtension
{
    private $icons;

    public function __construct(array $icons = [])
    {
        $this->icons = $icons;
    }

    /**
     * {@inheritdoc}
     */
    public function setEngine(EngineInterface $engine)
    {
        $engine->addType('svg');
        parent::setEngine($engine);
    }

    /**
     * {@inheritdoc}
     */
    public function functions()
    {
        return [
            new TemplateFunction('svg', [$this, 'svg'], ['is_safe_html' => true]),
            new TemplateFunction('icon', [$this, 'icon'], ['is_safe_html' => true]),
        ];
    }

    public function svg($src)
    {
        $this->getEngine()->display($src);
    }

    public function icon($name)
    {
        if (isset($this->icons[$name])) {
            $this->getEngine()->display($this->icons[$name]);
        }
    }
}
