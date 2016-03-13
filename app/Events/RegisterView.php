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
use Lucid\Template\ViewManagerInterface as View;
use Lucid\Template\EngineInterface as Engine;

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
    /** @var Engine */
    private $engine;

    /**
     * Constructor.
     *
     * @param View $view
     */
    public function __construct(View $view, Engine $engine)
    {
        $this->view = $view;
        $this->engine = $engine;
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

    /**
     * getView
     *
     * @return View
     */
    public function getEngine()
    {
        return $this->engine;
    }
}
