<?php

/*
 * This File is part of the App\Model package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Model;

use App\Api\Generator;
use App\File\FileInfo;
use App\File\PatternIterator;
use Thapp\Jmg\Parameters as Params;
use Thapp\Jmg\ParamGroup;
use Thapp\Jmg\FilterExpression as Filters;
use Thapp\Jmg\Resolver\PathResolverInterface;

/**
 * @class ImageRepository
 *
 * @package App\Model
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class ImageRepository
{
    /* @var App\Api\Generator */
    private $gen;

    /* @var Thapp\Jmd\Resolver\PathResolverInterface */
    private $paths;

    /**
     * Constructor.
     *
     * @param Generator $gen
     * @param PathResolverInterface $paths
     */
    public function __construct(Generator $gen, PathResolverInterface $paths)
    {
        $this->generator = $gen;
        $this->paths = $paths;
    }

    /**
     * fetch
     *
     * @param string $prefix
     * @param Params $params
     * @param Filters $filters
     * @param string $src
     * @param int $limit
     * @param bool $q
     *
     * @return array
     */
    public function fetch($prefix, ParamGroup $params, $src = null, $limit = -1, $q = false)
    {
        if (null !== $src) {
            return [$this->generator->fromParams($src, $params, $prefix, $q)];
        }

        if (!$path = $this->paths->resolve($prefix)) {
            return [];
        }

        return array_map(function ($file) use ($params, $prefix, $q) {
            return $this->generator->fromParams($file, $params, $prefix, $q);
        }, $this->glob($path, $limit));

    }

    /**
     * Globs a given path for images.
     *
     * @param string $path
     *
     * @return array
     */
    private function glob($path, $limit, $maxDepth = 1)
    {
        return array_map(function ($info) {
            return $info->getRelativePathName();
        }, iterator_to_array($this->getIterator($path, $maxDepth, $limit)));
    }

    /**
     * getIterator
     *
     * @param string $path
     * @param int $depth
     * @param int $limit
     *
     * @return Iterator.
     */
    private function getIterator($path, $depth = 1, $limit = -1)
    {
        return new PatternIterator($path, '~\.(jpe?g|png|gif)$~', $depth, $limit);
    }
}
