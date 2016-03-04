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

use FilesystemIterator;
use InvalidArgumentException;
use RecursiveDirectoryIterator as BaseIterator;

/**
 * @class RecursiveDirectoryIterator
 * @see BaseIterator
 *
 * @package App\File
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class RecursiveDirectoryIterator extends BaseIterator
{
    /**
     * Creates a new Recursive Directory Iterator.
     *
     * @param string  $path
     * @param integer $flags
     * @throws InvalidArgumentException if $flags contain an
     * CURRENT_AS_* flag other then CURRENT_AS_FILEINFO.
     *
     * @access public
     */
    public function __construct($path, $flags = null)
    {
        if ($flags & (FilesystemIterator::CURRENT_AS_SELF|FilesystemIterator::CURRENT_AS_PATHNAME)) {
            throw new InvalidArgumentException(
                sprintf('%s only supports FilesystemIterator::CURRENT_AS_FILEINFO', __CLASS__)
            );
        }

        parent::__construct($path, $flags);
    }

    /**
     * {@inheritdoc}
     */
    public function current()
    {
        return new FileInfo(parent::current()->getPathname(), $this->getSubPath(), $this->getSubPathname());
    }
}
