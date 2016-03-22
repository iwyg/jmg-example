<?php

/*
 * This File is part of the App\Config package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Config;

use ArrayAccess;
use RuntimeException;
use Lucid\Common\Helper\Arr;

/**
 * @class Config
 *
 * @package App\Config
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class Config implements ArrayAccess
{
    /** @var string */
    const NS_SEPARATOR = ':';

    /** @var array */
    private $pool;

    /** @var array */
    private $config;

    /** @var string */
    private $path;

    /**
     * Constructor.
     *
     * @param string $path
     */
    public function __construct($path)
    {
        $this->pool   = [];
        $this->config = [];
        $this->path   = $path;
    }

    /**
     * Loads config files.
     *
     * @param array $files
     *
     * @return void
     */
    public function load(array $files)
    {
        foreach ($files as $file) {
            if (file_exists($resource = $this->path.DIRECTORY_SEPARATOR.$file) &&
                'php' === pathinfo(strtolower($resource), PATHINFO_EXTENSION)) {
                $this->config = array_merge($this->config, include $resource);
            }
        }
    }

    /**
     * Returns a configuration value by key.
     *
     * @param string $key
     * @param mixed $default
     *
     * @return mixed
     */
    public function get($key, $default = null)
    {
        if (isset($this->pool[$key])) {
            return $this->pool[$key];
        }

        if (null !== $res = Arr::get($this->config, $key, self::NS_SEPARATOR)) {
            return $this->pool[$key] = $res;
        }

        return $default;
    }

    /**
     * {@inheritdoc}
     */
    public function offsetExists($offset)
    {
        return (bool)$this->get($offset, false);
    }

    /**
     * {@inheritdoc}
     */
    public function offsetGet($offset)
    {
        return $this->get($offset, null);
    }

    /**
     * {@inheritdoc}
     * @thros \RuntimeException readonly access
     */
    public function offsetUnset($offset)
    {
        throw new RuntimeException('Config is read only.');
    }

    /**
     * {@inheritdoc}
     * @thros \RuntimeException readonly access
     */
    public function offsetSet($offset, $values)
    {
        throw new RuntimeException('Config is read only.');
    }
}
