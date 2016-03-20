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

use Lucid\Xml\Dom\DOMDocument;

/**
 * @class Processor
 *
 * @package App\Markdown\Post
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class Processor implements ProcessorInterface
{
    /** @var DOMDocument */
    private $dom;

    /** @var array */
    private $parser;

    /**
     * Constructor.
     *
     * @param ParserInterface ...$parser list of parsers.
     */
    public function __construct(ParserInterface ...$parser)
    {
        $this->parser = $parser;
    }

    /**
     * {@inheritdoc}
     */
    public function load($parsed)
    {
        $this->dom = new DOMDocument;
        $this->dom->loadHtml($parsed, LIBXML_HTML_NODEFDTD);
    }

    /**
     * {@inheritdoc}
     */
    public function process()
    {
        if (null === $this->dom) {
            throw new \RuntimeException('No document loaded.');
        }

        foreach ($this->parser as $parser) {
            $parser->parse($this->dom);
        }

        $parsed = $this->dom->saveHTML();
        $this->dom = null;

        return $parsed;
    }
}
