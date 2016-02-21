<?php

/*
 * This File is part of the App\Events package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\Events;

use Lucid\Signal\Event;
use Negotiation\Negotiator;

/**
 * @class ContentTypeEvent
 *
 * @package App\Events
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class ContentTypeEvent extends Event
{
    public function __construct(Negotiator $negotiator, $accepts = '*/*')
    {
        $this->negotiator = $negotiator;
        $this->accepts = $accepts;
    }

    public function accepts(array $range)
    {
        return $this->negotiator->getBest($this->accepts, $range);
    }
}
