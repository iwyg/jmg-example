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

/**
 * @class FilesystemIterator
 * @package App\File
 * @version $Id$
 */
class FilesystemIterator extends \FilesystemIterator
{
    use SubstitudePath;

    /** @var string */
    private $currentPath;

    /** @var string */
    private $rootPath;

    /** @var string */
    private $subPath;

    /**
     * Constructor.
     *
     * @param string $path
     * @param int $flags
     * @param string $rootpath
     */
    public function __construct($path, $flags = null, $rootpath = null)
    {
        if ($flags & (\FilesystemIterator::CURRENT_AS_SELF|\FilesystemIterator::CURRENT_AS_PATHNAME)) {
            throw new \InvalidArgumentException(
                sprintf('%s only supports FilesystemIterator::CURRENT_AS_FILEINFO', __CLASS__)
            );
        }

        $this->currentPath = $path;
        $this->setRootPath($rootpath);

        parent::__construct($path, $flags);
    }

    /**
     * current
     *
     * @return SplFileInfo
     */
    public function current()
    {
        $info = new FileInfo(
            parent::current()->getPathname(),
            $this->getSubPath(),
            $this->getSubPathname(parent::current()->getBasename())
        );

        return $info;
    }

    /**
     * getSubPath
     *
     * @return string
     */
    private function getSubPath()
    {
        return $this->subPath;
    }

    /**
     * getSubPathname
     *
     * @return string
     */
    private function getSubPathname($basename = null)
    {
        return ltrim($this->subPath.DIRECTORY_SEPARATOR.$basename, '\/');
    }

    /**
     * setRootPath
     *
     * @param mixed $path
     *
     * @return void
     */
    private function setRootPath($path)
    {
        $this->rootPath = $path;
        $this->subPath = $this->substitutePaths($path, $this->currentPath);
    }
}
