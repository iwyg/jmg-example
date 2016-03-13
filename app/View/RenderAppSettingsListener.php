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

use App\Config\Config;
use Thapp\Jmg\ProcessorInterface;
use Lucid\Template\Data\TemplateDataInterface;
use Lucid\Template\Listener\ListenerInterface;

/**
 * @class
 *
 * @package
 * @version $Id$
 * @author  <>
 */
class RenderAppSettingsListener implements ListenerInterface
{
    private $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function onRender(TemplateDataInterface $data)
    {
        $data->set(['jmg_config' => json_encode(
            $this->parseValues(),
            JSON_NUMERIC_CHECK | JSON_FORCE_OBJECT
        )]);
    }

    private function parseValues()
    {
        $defaults = self::defaults();
        $keys = array_keys($defaults);
        $data = $this->config->get('jmg.mode_constraints', []);
        $config = array_combine($keys, array_map(function ($key) use ($defaults, $data) {
            return isset($data[$key]) ? $data[$key] : $defaults[$key];
        }, $keys));

        $map = [];

        $minVals = $this->config->get('playground');

        foreach ($config as $mode => $values) {
            switch ($mode) {
                case 0:
                    $map[$mode] = [];
                    break;
                case 5:
                    $map[$mode]['maxScale'] = $values[0];
                    $map[$mode]['minScale'] = $minVals['minScale'];
                    break;
                case 6:
                    $map[$mode]['maxPx'] = $values[0];
                    $map[$mode]['minPx'] = $minVals['minPx'];
                    break;
                default:
                    $map[$mode]['maxW'] = $values[0];
                    $map[$mode]['maxH'] = $values[1];
                    $map[$mode]['minW'] = $minVals['minW'];
                    $map[$mode]['minH'] = $minVals['minH'];
                    break;
            }
        }

        return $map;
    }

    private static function defaults()
    {
        return [
            ProcessorInterface::IM_NOSCALE      => [],
            ProcessorInterface::IM_RESIZE       => [2400, 2400],
            ProcessorInterface::IM_SCALECROP    => [2400, 2400],
            ProcessorInterface::IM_CROP         => [2400, 2400],
            ProcessorInterface::IM_RSIZEFIT     => [2400, 2400],
            ProcessorInterface::IM_RSIZEPERCENT => [200],
            ProcessorInterface::IM_RSIZEPXCOUNT => [4000000],
        ];
    }

    private static function defaultMin()
    {
        return [
            'minW'     => 100,
            'minH'     => 100,
            'minPx'    => 1000,
            'minScale' => 10,
        ];
    }
}
