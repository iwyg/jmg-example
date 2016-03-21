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

use Lucid\Xml\Dom\DOMElement;
use Lucid\Xml\Dom\DOMDocument;

/**
 * @class ReplaceExternalLinks
 *
 * @package App\Markdown
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class ReplaceExternalLinks implements ParserInterface
{
    /** @var DOMElement */
    private $icon;

    /** @var string */
    private $svgPath;

    /** @var string */
    private $linkClass;

    /** @var string */
    private $iconClass;

    /**
     * Constructor.
     *
     * @param mixed $svgPath
     * @param string $linkClass
     * @param string $iconClass
     */
    public function __construct($svgPath, $linkClass = 'link ext', $iconClass = 'icon')
    {
        $this->svgPath = $svgPath;
        $this->linkClass = $linkClass;
        $this->iconClass = $iconClass;
    }

    /**
     * {@inheritdoc}
     */
    public function parse(DOMDocument $dom)
    {
        foreach ($dom->xpath('//a[starts-with(@href,\'http\')]') as $link) {
            if (!$link instanceof DOMElement) {
                continue;
            }
            $this->wrap($dom, $link);
        }

        return $dom;
    }

    /**
     * wrap
     *
     * @param DOMDocument $dom
     * @param DOMElement $link
     *
     * @return void
     */
    private function wrap(DOMDocument $dom, DOMElement $link)
    {
        $link->setAttribute('class', $this->linkClass);
        $link->setAttribute('target', '_blanc');

        $icon = $dom->createElement('span');
        $icon->setAttribute('class', $this->iconClass);
        $icon->appendDomElement($this->getIcon());

        $textContent = $link->textContent;

        $link->textContent = null;
        $link->appendDomElement($icon);
        $link->appendChild(new \DOMText($textContent));
    }

    /**
     * getIcon
     *
     * @return DOMElement
     */
    private function getIcon()
    {
        if (null === $this->icon) {
            $dom = new DOMDocument('1.0', 'UTF-8');
            $dom->load(realpath($this->svgPath));
            $this->icon = $dom->firstChild;
        }

        return $this->icon;
    }
}
