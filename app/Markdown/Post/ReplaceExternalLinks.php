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

use Lucid\Xml\Dom\DOMElement;
use Lucid\Xml\Dom\DOMDocument;

/**
 * @class ReplaceExternalLinks
 *
 * @package App\Markdown\Post
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class ReplaceExternalLinks implements ParserInterface
{
    private $icon;

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

    private function wrap(DOMDocument $dom, DOMElement $link)
    {
        $link->setAttribute('class', 'link int');
        $spanA = $dom->createElement('span');
        $spanA->setAttribute('class', 'text');
        $this->setIcon($spanA);

        $spanB = $dom->createElement('span');
        $spanB->setAttribute('class', 'icon');
        $spanB->textContent = $link->textContent;

        $link->textContent = null;
        $link->appendDomElement($spanA);
        $link->appendDomElement($spanB);
    }

    private function setIcon(DOMElement $span)
    {
        if (null === $this->icon) {
            $dom = new DOMDocument;
            $dom->load(realpath(__DIR__.'/../resources/icon_link.svg'));
            $this->icon = $dom->firstChild;
        }

        $span->appendDomElement($this->icon);
    }
}
