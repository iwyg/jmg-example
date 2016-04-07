<?php

/*
 * This File is part of the App\View package
 *
 * (c) iwyg <mail@thomas-appel.com>
 *
 * For full copyright and license information, please refer to the LICENSE file
 * that was distributed with this package.
 */

namespace App\View;

use Lucid\Template\Data\TemplateDataInterface;
use Lucid\Template\Listener\ListenerInterface;

/**
 * @class RenderGaScriptListener
 *
 * @package App\View
 * @version $Id$
 * @author iwyg <mail@thomas-appel.com>
 */
class RenderGaScriptListener implements ListenerInterface
{
    /** @var string */
    private $id;

    /**
     * Constructor.
     *
     * @param string $trackingId
     */
    public function __construct($trackingId)
    {
        $this->id = $trackingId;
    }

    /**
     * {@inheritdoc}
     */
    public function onRender(TemplateDataInterface $data)
    {
        $data->set(['ga_tracking_id' => $this->id]);
    }
}
