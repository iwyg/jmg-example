<?php

/*
 * This File is part of the App\Mardown\Loader package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Markdown\Loader;

use App\File\PatternIterator;
use Lucid\Resource\FileResource;

/**
 * @class FilesystemLoader
 *
 * @package App\Mardown\Loader
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class Filesystem implements LoaderInterface
{
    /** @var int */
    const DEFAULT_DEPTH = 2;

    /** @var string */
    const DEFAULT_EXTENSIONS = 'md|mdown|markdown';

    /** @var string */
    private $path;

    /** @var int */
    private $depth;

    /** @var array */
    private $extensions;

    /** @var string */
    private $extPattern;

    /** @var string */
    private $basePattern;

    /**
     * Constructor.
     *
     * @param string $lookupPath
     * @param int $depth
     * @param array $ext
     */
    public function __construct($lookupPath, $depth = self::DEFAULT_DEPTH, array $ext = null)
    {
        $this->path       = $lookupPath;
        $this->depth      = $depth;
        $this->extensions = $ext ?: explode('|', self::DEFAULT_EXTENSIONS);
        $this->extPattern = [];
    }

    /**
     * {@inheritdoc}
     */
    public function load($markdown)
    {
        if ($file = current(iterator_to_array($this->getIterator($markdown)))) {
            return new FileResource($file->getPathname());
        }

        throw new \RuntimeException(sprintf('No resource found for "%s".', $markdown));
    }

    /**
     * getIterator
     *
     * @param string $name
     *
     * @return Iterator
     */
    private function getIterator($name)
    {
        $name = pathinfo($name, PATHINFO_FILENAME);
        return new PatternIterator($this->getBasePath(), $this->getExtPattern($name), $this->depth, 1);
    }

    /**
     * getBasePath
     *
     * @return string
     */
    private function getBasePath()
    {
        return $this->path;
    }

    /**
     * getExtPattern
     *
     * @param string $name
     *
     * @return string
     */
    private function getExtPattern($name)
    {
        if (!isset($this->extPattern[$name])) {
            $this->extPattern[$name] = sprintf($this->getBasePattern(), preg_quote($name, '~'));
        }

        return $this->extPattern[$name];
    }

    /**
     * getBasePattern
     *
     * @return string
     */
    private function getBasePattern()
    {
        if (null === $this->basePattern) {
            $this->basePattern = sprintf('~[^\.]%%s\.(%s)~', implode('|', $this->extensions));
        }

        return $this->basePattern;
    }
}
