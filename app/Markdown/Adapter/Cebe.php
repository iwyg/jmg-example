<?php

/*
 * This File is part of the App\Mardown\Adapter package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Markdown\Adapter;

use cebe\markdown\Parser;
use App\Markdown\Post\ProcessorInterface;

/**
 * @class Cebe
 *
 * @package App\Mardown\Adapter
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class Cebe implements AdapterInterface
{
    /** @var Parser */
    private $parser;

    /** @var ProcessorInterface */
    private $proc;

    /**
     * Constructor
     *
     * @param Parser $parser
     */
    public function __construct(Parser $parser, ProcessorInterface $proc = null)
    {
        $this->parser = $parser;
        $this->proc = $proc;
    }

    /**
     * {@inheritdoc}
     */
    public function parse($markdown)
    {
        $parsed =  $this->parser->parse($markdown);

        if (null !== $this->proc) {
            $this->proc->load($parsed);
            return $this->proc->process();
        }

        return $parsed;
    }
}
