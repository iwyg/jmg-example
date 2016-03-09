<?php

/*
 * This File is part of the  package
 *
 * (c)  <>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Api;

use Thapp\Jmg\ParamGroup;
use Thapp\Jmg\Parameters as Params;
use Thapp\Jmg\FilterExpression as Filters;
use Thapp\Jmg\Resolver\ImageResolverInterface;
use Thapp\Jmg\Resolver\RecipeResolverInterface;
use Thapp\Jmg\Http\UrlBuilderInterface as Url;
use Thapp\Jmg\Resource\ResourceInterface;
use Thapp\Jmg\Resource\CachedResourceInterface;

class Generator
{
    private $resolver;
    private $recipes;
    private $url;
    private $cachePrefix;

    public function __construct(ImageResolverInterface $resolver, RecipeResolverInterface $rec, Url $url, $cpfx)
    {
        $this->resolver = $resolver;
        $this->recipes = $rec;
        $this->url = $url;
        $this->cachePrefix = $cpfx;
    }

    /**
     * fromParams
     *
     * @param mixed $src
     * @param Params $params
     * @param Filters $filters
     * @param string $prefix
     * @param mixed $q
     *
     * @return void
     */
    public function fromParams($src, ParamGroup $params, $prefix = '', $q = false)
    {
        if (!$resource = $this->resolver->resolve($src, $params, $prefix)) {
            return [];
        }

        return $this->getParsed($resource, $src, $prefix, $params, null, $q);
    }

    /**
     * fromRecipe
     *
     * @param mixed $recipe
     * @param mixed $src
     *
     * @return void
     */
    public function fromRecipe($recipe, $src)
    {
        list($prefix, $params) = $recipe->resolve($recipe);

        if (null === $params) {
            return [];
        }

        if (!$resource = $this->resolver->resolve($src, $params, $prefix)) {
            return [];
        }

        return $this->getParsed($resource, $src, $prefix, $params, $recipe, $q);
    }

    /**
     * getParsed
     *
     * @param ResourceInterface $resource
     * @param string $src
     * @param string $prefix
     * @param Params $params
     * @param Filters $filters
     * @param string $recipe
     * @param bool $asQuery
     *
     * @return array
     */
    private function getParsed(
        ResourceInterface $resource,
        $src,
        $prefix,
        ParamGroup $params,
        $recipe = null,
        $asQuery = false
    ) {
        if ($resource instanceof CachedResourceInterface) {
            $uri = $this->url->fromCached($resource, $this->cachePrefix, $prefix);
        } elseif (null !== $recipe) {
            $uri = $this->url->fromRecipe($recipe, $src);
        } else {
            $uri = $this->url->withQuery($prefix, $src, $params);
        }

        return [
            'uri'    => $uri,
            'name'   => $src,
            'height' => $resource->getHeight(),
            'width'  => $resource->getWidth(),
            'type'   => $resource->getMimeType(),
            'hash'   => $resource->getHash(),
            'color'   => $resource->getColorSpace()
        ];
    }
}
