<?php

/*
 * This File is part of the App\File package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\File;

use RegexIterator;
//use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * @class PatternIterator
 * @see RegexIterator
 *
 * @package App\File
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class PatternIterator extends RegexIterator
{
    /**
     * Constructor.
     *
     * @param string $path
     * @param string $pattern
     * @param int    $depth
     * @param int    $limit
     * @param int    $flags
     * @param int    $dirFlags
     */
    public function __construct($path, $pattern, $depth = null, $limit = -1, $flags = self::MATCH, $dirFlags = null)
    {
        $this->limit = $limit;
        parent::__construct($this->createInnerIterator($path, $depth, $dirFlags), $pattern, $flags);
    }

    /**
     * setMaxDepth
     *
     * @param int $depth
     *
     * @return void
     */
    public function setMaxDepth($depth = -1)
    {
        $this->getInnerIterator->setMaxDept((int)$depth);
    }

    /**
     * getMaxDepth
     *
     * @return int
     */
    public function getMaxDepth()
    {
        return $this->getInnerIterator->getMaxDept();
    }

    /**
     * {@inheritdoc}
     */
    public function valid()
    {
        if ($this->limit > -1 && $this->max === $this->limit) {
            return false;
        }

        return parent::valid();
    }

    /**
     * {@inheritdoc}
     */
    public function next()
    {
        $this->max++;

        return parent::next();
    }

    /**
     * {@inheritdoc}
     */
    public function rewind()
    {
        $this->max = 0;
        parent::rewind();
    }

    /**
     * getRecursiveIterator
     *
     * @param string $path
     * @param int    $depth
     * @param int    $flags
     *
     * @return RecursiveIteratorIterator
     */
    private function createInnerIterator($path, $depth = null, $flags = null)
    {
        $rcit = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($path, $flags)
        );

        if (0 > (int)$depth) {
            $rcit->setMaxDepth($depth);
        }

        return $rcit;
    }
}
