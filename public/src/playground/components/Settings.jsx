import React, {PropTypes} from 'react';
import MODES from 'playground/modules/modes';
import {IconButton} from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
import {className, callIfFunc} from 'lib/react-helper';
import {Resize, CropScale, Crop, ResizeFit, Scale} from './select/ValueSelect';
import debounce from 'lodash.debounce';

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

const ModeIndexMap = (function () {
  let map = {};
  Object.keys(MODES).forEach((mode, i) => {
    map[i] = mode;
  });

  return map;
}());

const mapTabToMode = (index) => {
  return MODES[ModeIndexMap[index]];
};

const mapModeToIndex = (function(){
  let map = {};
  Object.keys(MODES).forEach((mode, i) => {
    map[MODES[mode]] = i;
  });

  return (mode => map[mode]);
}());

const Icn = ({children, ...props}) => {
  let cName = className('icon', props);
  return (<span {...props} className={cName}>{children}</span>);
};

const TooltipIcon = Tooltip(Icn);

export class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: []
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.onModeChange = this.onModeChange.bind(this);
    this.settingDidChange = this.settingDidChange.bind(this);
  }

  onModeChange(i, tab) {
    let {index, onModeChange} = this.props;
    onModeChange(index, mapTabToMode(i));
  }

  onUpdate() {
    let {onUpdate} = this.props;
    onUpdate()
  }

  settingDidChange(mode, params) {
    let {onUpdate, index} = this.props;
    onUpdate(index, mode, params);
  }

  renderResize(params, constr) {
    console.log('RESIZE', params);
    let key = 'resize-'+this.props.index;
    return (
      <Resize key={key} {...constr} {...params} onChange={this.settingDidChange} />
    );
  }

  renderScaleCrop(params, constr) {
    let key = 'scale-crop-'+this.props.index;
    return (
      <CropScale key={key} {...constr} {...params} onChange={this.settingDidChange} />
    );
  }

  renderCrop(params, constr) {
    let key = 'crop-'+this.props.index;
    return (
      <Crop key={key} {...constr} {...params} onChange={this.settingDidChange} />
    );
  }

  renderResizeFit(params, constr) {
    let key = 'fit-'+this.props.index;
    return (
      <ResizeFit key={key} {...constr} {...params} onChange={this.settingDidChange} />
    );
  }

  renderScale(params, constr) {
    let key = 'scale-'+this.props.index;
    let {minScale, maxScale, ...c} = constr;
    return (
      <Scale key={key} label='Scale' {...c} {...params} minW={minScale} maxW={maxScale}
      mode={MODES.IM_RSIZEPERCENT}
      onChange={this.settingDidChange} unit={'%'}/>
    );
  }

  renderPx(params, constr) {
    let key = 'pixel-'+this.props.index;
    let {minPx, maxPx, ...c} = constr;
    return (
      <Scale key={key} label='Px' {...c} {...params} minW={minPx} maxW={maxPx}
      mode={MODES.IM_RSIZEPXCOUNT}
      onChange={this.settingDidChange} unit={''}/>
    );
  }

  renderContent(mode) {
    let {params, constraints} = this.props;
    switch (mode) {
      case MODES.IM_RESIZE:
        return this.renderResize(params[mode], constraints[mode]);
      case MODES.IM_SCALECROP:
        return this.renderScaleCrop(params[mode], constraints[mode]);
      case MODES.IM_CROP:
        return this.renderCrop(params[mode], constraints[mode]);
      case MODES.IM_RSIZEFIT:
        return this.renderResizeFit(params[mode], constraints[mode]);
      case MODES.IM_RSIZEPERCENT:
        return this.renderScale(params[mode], constraints[mode]);
      case MODES.IM_RSIZEPXCOUNT:
        return this.renderPx(params[mode], constraints[mode]);
      default:
        return null;
    }
  }

  render() {
    return (
      <section className={className('setting', this.props)}>
        <header>
          <Pane onTabChange={this.onModeChange} activeTab={mapModeToIndex(this.props.mode)}></Pane>
        </header>
        <div className='setting-content'>{this.renderContent(this.props.mode)}</div>
      </section>
    );
  }
}

Settings.propTypes = {
  constraints: PropTypes.object.isRequired,
  mode: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onModeChange: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  filters: PropTypes.array
};

Settings.defaultProps = {
  current: 0,
  filters: []
};

export class Pane extends React.Component {
  constructor(props) {
    super(props);

    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(index) {
    let {onTabChange} = this.props;
    onTabChange(index);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.activeTab === this.props.activeTab) {
      return;
    }

    //callIfFunc(this.props.onTabChange, null, nextProps.activeTab, this.refs['tab-' + (1 + nextProps.activeTab)]);
  }

  renderTabs() {

    let {activeTab} = this.props;

    return (
      <Tabs activeTab={activeTab}>{
        Object.keys(labelMap).map((key, i) => {
          let {...props} = labelMap[key];
          return (<Tab key={i} ref={'tab-' + (1 + i)} index={i} active={activeTab === i} onClick={this.onTabChange} {...props} ></Tab>)
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

Pane.propTypes = {
  activeTab: PropTypes.number,
  onTabChange: PropTypes.func.isRequired
};

Pane.defaultProps = {
  activeTab: 0
};

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.tabs = [];
    this.state = {
      index: 0
    };
  }

  componentDidMount() {
    console.log('TABS', this);
  }

  findTabs(children) {
    return React.Children.toArray(children).filter((c) => {
      return c.type === Tab || c.type.prototype.constructor === Tab;
    });
  }

  componentWillUpdate(nextProps)  {
    this.tabs = this.findTabs(nextProps.children);
    console.log(this.tabs);
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

    this.willBeActive = this.willBeActive.bind(this);
  }

  willBeActive() {
    if (this.props.active) {
      return;
    }

    callIfFunc(this.props.onClick, null, this.props.index);
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
      <li onClick={this.willBeActive} className={className('tab', this.props) + (this.props.active ? ' active' : '')}>
        {label}
      </li>
    );
  }
}

Tab.propTypes = {
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.func,
  label: PropTypes.string.isRequired,
  iconOnly: PropTypes.bool
};

Tab.defaultProps = {
  active: false,
  iconOnly: true
};
