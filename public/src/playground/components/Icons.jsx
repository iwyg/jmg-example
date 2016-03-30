import React from 'react';
import Tooltip from 'react-toolbox/lib/tooltip';
import {className, classNames} from 'lib/react-helper';

// icons for grid layouts
export const IconLayoutMasonry = require('icons/ic_dashboard_black_48px.svg');
export const IconLayoutGrid    = require('icons/ic_view_module_black_48px.svg');

// icons for settings panel
export const IconSettings      = require('icons/ic_tune_black_48px.svg');
export const IconFilter        = require('icons/ic_filter_black_48px.svg');

// icons for edit modes
export const IconModePass      = require('icons/ic_crop_3_2_black_48px.svg');
export const IconModeResize    = require('icons/ic_crop_free_black_48px.svg');
export const IconModeScaleCrop = require('icons/ic_transform_black_48px.svg');
export const IconModeCrop      = require('icons/ic_crop_black_48px.svg');
export const IconModeScale     = require('icons/ic_image_aspect_ratio_black_48px.svg');
export const IconModeFit       = require('icons/ic_photo_size_select_large_black_48px.svg');
export const IconModePx        = require('icons/ic_view_comfy_black_48px.svg');

// misc icons
export const IconAdd           = require('icons/ic_add_black_48px.svg');
export const IconRemove        = require('icons/ic_remove_black_48px.svg');
export const IconRemoveCirc    = require('icons/ic_remove_circle_outline_black_48px.svg');
export const IconAddCirc       = require('icons/ic_add_circle_outline_black_48px.svg');
export const IconClose         = require('icons/ic_close_black_48px.svg');
export const IconCheck         = require('icons/ic_check_black_48px.svg');
export const IconLink          = require('icons/ic_link_black_48px.svg');

// toggle icons
export const IconExpandLess    = require('icons/ic_expand_less_black_48px.svg');
export const IconExpandMore    = require('icons/ic_expand_more_black_48px.svg');
export const IconMoreHr        = require('icons/ic_more_horiz_black_48px.svg');

export const IconJmg           = require('icons/jmg.svg');

export const Icon = ({children, button, ...props}) => {
  let cName = className('icon', props);
  let El = button === true ? 'button' : 'span';
  return (<El {...props} className={classNames(cName, {button: button})}>{children}</El>);
};

export const TooltipIcon = Tooltip(Icon);
