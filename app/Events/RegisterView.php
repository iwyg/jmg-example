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
use Lucid\Template\EngineInterface as View;

/**
 * @class RegisterView
 *
 * @package App\Events
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class RegisterView extends Event
{
    /** @var View */
    private $view;

    /**
     * Constructor.
     *
     * @param View $view
     */
    public function __construct(View $view)
    {
        $this->view = $view;
    }

    /**
     * getView
     *
     * @return View
     */
    public function getView()
    {
        return $this->view;
    }
}
