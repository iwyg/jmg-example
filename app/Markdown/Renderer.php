<?php

/*
 * This File is part of the App\Markdown package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Markdown;

use Lucid\Resource\ResourceInterface;
use App\Markdown\Cache\CacheInterface;
use App\Markdown\Adapter\AdapterInterface;
use App\Markdown\Loader\LoaderInterface;

/**
 * @class AbstractRenderer
 *
 * @package App\Markdown
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class Renderer implements RenderInterface
{
    private $loader;
    private $adapter;
    private $cache;

    /**
     * Constructor.
     *
     * @param AdapterInterface $adapter
     * @param LoaderInterface $loader
     * @param CacheInterface $cache
     */
    public function __construct(AdapterInterface $adapter, LoaderInterface $loader, CacheInterface $cache = null)
    {
        $this->adapter = $adapter;
        $this->loader  = $loader;
        $this->cache   = $cache;
    }

    /**
     * {@inheritdoc}
     */
    public function render($markdown)
    {
        if ($output = $this->getCached($resource = $this->loader->load($markdown))) {
            return $output;
        }

        return $this->renderResource($resource);
    }

    /**
     * getCached
     *
     * @param ResourceInterface $resource
     *
     * @return string
     */
    private function getCached(ResourceInterface $resource)
    {
        if (null !== $this->cache && $this->cache->has($resource)) {
            return $this->cache->get($resource);
        }
    }

    /**
     * renderResource
     *
     * @param ResourceInterface $resource
     *
     * @return string
     */
    private function renderResource(ResourceInterface $resource)
    {
        $rendered = $this->adapter->parse($contents = file_get_contents($resource));

        if (null !== $this->cache) {
            $this->cache->put($rendered, $resource);
        }

        return $rendered;
    }
}
