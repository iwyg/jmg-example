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
    private $pool;
    private $config;
    private $locator;
    private $paths;

    public function __construct($path)
    {
        $this->pool = [];
        $this->config = [];
        $this->path = $path;
    }

    public function load(array $files)
    {
        foreach ($files as $file) {
            if (file_exists($resource = $this->path.DIRECTORY_SEPARATOR.$file) &&
                'php' === pathinfo(strtolower($resource), PATHINFO_EXTENSION)) {
                $this->config = array_merge($this->config, include $resource);
            }
        }
    }

    public function get($key, $default = null)
    {
        if (isset($this->pool[$key])) {
            return $this->pool[$key];
        }

        if (null !== $res = Arr::get($this->config, $key, ':')) {
            return $this->pool[$key] = $res;
        }

        return $default;
    }

    public function offsetExists($offset)
    {
        return (bool)$this->get($offset);
    }

    public function offsetGet($offset)
    {
        return $this->get($offset, null);
    }

    public function offsetUnset($offset)
    {
        throw new \RuntimeException('Config is read only.');
    }

    public function offsetSet($offset, $values)
    {
        throw new \RuntimeException('Config is read only.');
    }
}
