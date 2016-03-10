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

    /**
     * Constructor
     *
     * @param Parser $parser
     */
    public function __construct(Parser $parser)
    {
        $this->parser = $parser;
    }

    /**
     * {@inheritdoc}
     */
    public function parse($markdown)
    {
        return $this->parser->parse($markdown);
    }
}
