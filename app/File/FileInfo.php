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

use SplFileInfo;

/**
 * @class FileInfo
 * @see SplFileInfo
 *
 * @package App\File
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class FileInfo extends SplFileInfo
{
    /** @var string
     */
    private $relativePath;

    /** @var string
     */
    private $relativePathName;

    /**
     * Constructor.
     *
     * @param mixed $file
     * @param mixed $relativePath
     * @param mixed $relativePathName
     */
    public function __construct($file, $relativePath = null, $relativePathName = null)
    {
        parent::__construct($file);

        $this->relativePath     = $relativePath;
        $this->relativePathName = $relativePathName;
    }

    /**
     * getRelativePath
     *
     * @return string
     */
    public function getRelativePath()
    {
        return $this->relativePath;
    }

    /**
     * getRelativePathName
     *
     * @return string
     */
    public function getRelativePathName()
    {
        return $this->relativePathName;
    }

    /**
     * toArray
     *
     * @return array
     */
    public function toArray()
    {
        $attributes = [
            'name'             => $this->getBasename(),
            'path'             => $this->getRealPath(),
            'relativePath'     => $this->getRelativePath(),
            'relativePathName' => $this->getRelativePathName(),
            'lastmod'          => $this->getMTime(),
            'type'             => $this->getType(),
            'owner'            => $this->getOwner(),
            'group'            => $this->getGroup(),
            'size'             => $this->getSize()
        ];

        if ($this->isFile()) {
            $attributes['extension'] = $this->getExtension();
            $attributes['mimetype']  = finfo_file(finfo_open(FILEINFO_MIME_TYPE), $this->getRealPath());
        }
        return $attributes;
    }
}
