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
use App\Env\Detect;
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

    /** @var Detect */
    private $env;

    /**
     * Constructor.
     *
     * @param string $path
     */
    public function __construct($path, Detect $env)
    {
        $this->pool   = [];
        $this->config = [];
        $this->path   = $path;
        $this->env    = $env;
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
        $conf = [];

        foreach ($files as $file) {
            if (file_exists($resource = $this->path.DIRECTORY_SEPARATOR.$file) &&
                'php' === pathinfo(strtolower($resource), PATHINFO_EXTENSION)) {
                $conf = $this->findFilesAndMerge($resource, $conf);
                //$conf = array_merge($conf, include $resource);
            }
        }


        $this->config = $conf;
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

    /**
     * Merge env based files.
     *
     * @param string $file
     * @param array $conf
     *
     * @return array
     */
    private function findFilesAndMerge($file, array $conf)
    {
        $config = include $file;

        if (is_file($env = substr($file, 0, -3).$this->env.'.php')) {
            $config = array_merge($config, include $env);
        }

        return array_merge($conf, $config);
    }
}
