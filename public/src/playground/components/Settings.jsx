import React, {PropTypes} from 'react';
import MODES from 'playground/modules/modes';
import {IconButton} from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
import {className, callIfFunc} from 'lib/react-helper';
import ValueSelect, {Resize} from './select/ValueSelect';

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

//const TooltipButton = Tooltip(IconButton);

const Icn = ({children, ...props}) => {
  let cName = className('icon', props);
  return (<span {...props} className={cName}>{children}</span>);
};

const TooltipIcon = Tooltip(Icn);

export class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.onModeChange = this.onModeChange.bind(this);
  }

  onModeChange(i, tab) {
    let {index, onModeChange} = this.props;
    onModeChange(index, mapTabToMode(i));
  }

  onUpdate() {
    let {onUpdate} = this.props;
    onUpdate()
  }

  renderContent(index) {
    return (<ValueSelect ref='values' mode={index}
      maxW={2400} maxH={2400}
      minW={200} minH={200}
      maxPx={400000} minPx={1000}
      maxScale={200} minScale={10}
      color='RGB'
    />);
  }

  render() {
    return (
      <section className={className('setting', this.props)}>
        <header>
          <Pane onTabChange={this.onModeChange}></Pane>
        </header>
        <div className='setting-content'>{this.renderContent(this.props.mode)}</div>
      </section>
    );
  }
}

Settings.propTypes = {
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

    this.state = {
      activeTab: 0
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.transposeTabs = this.transposeTabs.bind(this);
  }

  transposeTabs() {
  }

  onTabChange(index) {
    console.log(index, this);
    let {onTabChange} = this.props;
    onTabChange(index);
  }

  componentWillMount() {
    this.setState({activeTab: this.props.activeTab});
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.activeTab === this.state.activeTab) {
      return;
    }
    callIfFunc(this.props.onTabChange, null, nextState.activeTab, this.refs['tab-' + (1 + nextState.activeTab)]);
  }

  renderTabs() {

    let {activeTab} = this.state;

    return (
      <Tabs activeTap={activeTab} refs={this.transposeTabs}>{
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

Tabs.propTypes = {
  refs: PropTypes.func.isRequired
};

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
