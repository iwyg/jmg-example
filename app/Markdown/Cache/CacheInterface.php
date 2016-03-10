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
 * @interface CacheInterface
 *
 * @package App\Markdown\Cache
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
interface CacheInterface
{
    public function has(ResourceInterface $resource);

    public function get(ResourceInterface $resource);

    public function put($rendered, ResourceInterface $resource);
}
