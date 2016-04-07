<?php

/*
 * This File is part of the App\Env package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Env;

/**
 * @class Detect
 *
 * @package App\Env
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class Detect
{
    /** @var string */
    private $env;

    /**
     * Constructor.
     *
     * @param array $server
     * @param string $key
     * @param string $default
     */
    public function __construct(array $server, $key = 'APP_ENV', $default = 'development')
    {
        $this->env = isset($server[$key]) ? $server[$key] : $default;
    }

    /**
     * @return string
     */
    public function get()
    {
        return $this->env;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->get();
    }
}
