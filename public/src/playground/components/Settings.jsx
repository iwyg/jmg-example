import React, {PropTypes} from 'react';
import MODES from 'playground/modules/modes';
import {IconButton} from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
import {className} from 'lib/react-helper';

import {
  IconModePass, IconModeResize, IconModeScaleCrop, IconModeCrop,
  IconModeScale, IconModeFit, IconModePx,
} from './Icons';

const labelMap = (function () {
  let map = {};
  map[MODES.IM_NOSCALE] = {
    icon: IconModePass, label: 'Pass through'
  };
  map[MODES.IM_RESIZE] = {
    icon: IconModeResize, label: 'Resize'
  };
  map[MODES.IM_SCALECROP] = {
    icon: IconModeScaleCrop, label: 'Scale and Crop'
  };
  map[MODES.IM_CROP] = {
    icon: IconModeCrop, label: 'Crop'
  };
  map[MODES.IM_RSIZEFIT] = {
    icon: IconModeFit, label: 'Best fit'
  };
  map[MODES.IM_RSIZEPERCENT] = {
    icon: IconModeScale, label: 'Scale'
  };
  map[MODES.IM_RSIZEPXCOUNT] = {
    icon: IconModePx, label: 'Pixel'
  };
  return map;
}());

const getInitialModes = (minW, minH, minPx, minScale) => {
  let modes = {};
  modes[MODES.IM_NOSCALE] = {};
  modes[MODES.IM_RESIZE] = {width: 0, height: 0};
  modes[MODES.IM_SCALECROP] = {width: minW, height: minH, gravity: 5};
  modes[MODES.IM_CROP] = {width: minW, height: minH, gravity: 5, background: 'f7f7f7'};
  modes[MODES.IM_RSIZEFIT] = {width: minW, height: minH};
  modes[MODES.IM_RSIZEPERCENT] = {width: minScale};
  modes[MODES.IM_RSIZEPXCOUNT] = {width: minPx};

  return modes;
};

//const TooltipButton = Tooltip(IconButton);

const Icn = ({children, ...props}) => {
  let cName = className('icon', props);
  return (<span {...props} className={cName}>{children}</span>);
};

const TooltipIcon = Tooltip(Icn);

export class Pane extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTabs() {

    return (
      <Tabs>{
        Object.keys(labelMap).map((key, i) => {
          let {...props} = labelMap[key];
          return (<Tab key={i} active={false} {...props} ></Tab>)
        })
      }</Tabs>
    )
  }

  render() {
    return (
      <section>
        <header>
          {this.renderTabs()}
        </header>
      </section>
    );
  }
}

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
  }
  render() {
    return (
      <ul className={className('tabs', this.props)}>
        {this.props.children}
      </ul>
    );
  }
}

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }

  renderLabel() {
    let {label, iconOnly} = this.props;
    let MyIcon = this.props.icon;

    if (iconOnly) {
      return (
        <label>
          <TooltipIcon flat={true} tooltip={label}>
            <MyIcon/>
          </TooltipIcon>
        </label>
      );
    }

    return (
      <label>
        <span className='icon'>
          <MyIcon/>
        </span>{label}
      </label>
    );
  }

  render() {
    let label = this.renderLabel();
    return (
      <li className={className('tab', this.props) + (this.props.active ? ' active' : '')}>
        {label}
      </li>
    );
  }
}

Tab.propTypes = {
  active: PropTypes.bool.isRequired,
  icon: PropTypes.func,
  label: PropTypes.string.isRequired,
  iconOnly: PropTypes.bool,
};

Tab.defaultProps = {
  active: false,
  iconOnly: true
};
