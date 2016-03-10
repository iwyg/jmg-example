<?php

/*
 * This File is part of the App\Markdown\Cache package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Markdown\Cache;

use Lucid\Resource\ResourceInterface;

/**
 * @class Filesystem
 *
 * @package App\Markdown\Cache
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class Filesystem implements CacheInterface
{
    /** @var string */
    private $path;

    /** @var array */
    private $pool;

    /**
     * Constructor.
     *
     * @param string $path
     */
    public function __construct($path)
    {
        $this->path = $path;
        $this->pool = [];
    }

    /**
     * {@inheritdoc}
     */
    public function has(ResourceInterface $resource)
    {
        if (!$resource->isValid(time())) {
            return false;
        }

        return file_exists($this->getPath($this->getHash($resource)));
    }

    /**
     * {@inheritdoc}
     */
    public function get(ResourceInterface $resource)
    {
        return file_get_contents($this->getPath($this->getHash($resource)));
    }

    /**
     * {@inheritdoc}
     */
    public function put($rendered, ResourceInterface $resource)
    {
        $path = $this->ensurePath($this->getHash($resource));

        return file_put_contents($path, $rendered);
    }

    /**
     * ensurePath
     *
     * @param string $hash
     *
     * @return string
     */
    private function ensurePath($hash)
    {
        if (!is_dir($dir = dirname($path = $this->getPath($hash)))) {
            mkdir($dir, 0775, true);
        }

        return $path;
    }

    /**
     * getPath
     *
     * @param string $hash
     *
     * @return string
     */
    private function getPath($hash)
    {
        return $this->path.DIRECTORY_SEPARATOR.$hash;
    }

    /**
     * getHash
     *
     * @param ResourceInterface $resource
     *
     * @return string
     */
    private function getHash(ResourceInterface $resource)
    {
        if (isset($this->pool[$key = (string)$resource])) {
            return $this->pool[$key];
        }

        $ds = DIRECTORY_SEPARATOR;
        return $this->pool[$key] = sprintf('%s%s%s', hash('sha1', dirname($key)), $ds, hash('sha1', basename($key)));
    }
}
