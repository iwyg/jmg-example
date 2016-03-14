import React, {PropTypes} from 'react';
import {IconButton} from 'react-toolbox/lib/button';
import MODES, {ModeNames, helper} from 'playground/modules/modes';
import {className, callIfFunc} from 'lib/react-helper';
import debounce from 'lodash.debounce';
import {assignFromObj} from 'lib/utils';
import SelectGroup from './select/SelectGroup';
import ColorSelect from './select/ColorSelect';
import {EditResize, EditResizeScale, EditCrop} from './select/EditGroups';
import {Tabs, Tab} from './Tabs';
import Collapsable from './Collapsable';
import {
  IconModePass, IconModeResize, IconModeScaleCrop, IconModeCrop,
  IconModeScale, IconModeFit, IconModePx, IconMoreHr,
  IconClose
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


const tabClickNull = () => {
  return null;
};

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



export class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.onModeChange = this.onModeChange.bind(this);
    this.settingDidChange = debounce(this.settingDidChange.bind(this), 200);
    this.onToggle = this.onToggle.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  onToggle(visible) {
    let {index, onToggle} = this.props;
    onToggle(index, visible);
    //this.setState({visible});
  }

  onRemove() {
    let {index, onRemove} = this.props;
    onRemove(index);
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
    let key = 'resize-'+this.props.index;
    return (
      <Resize key={key} {...constr} {...params} onChange={this.settingDidChange} minW={0} minH={0}/>
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
        unitVal={(val) => (val / 10e5).toFixed(1)}
      onChange={this.settingDidChange} unit={'M'}/>
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

    let closeBtn = (<IconButton className='icon close' onClick={this.onRemove}> <IconClose></IconClose></IconButton>);
    let header = this.props.visible ? (<Pane
        contentBefore={closeBtn}
        onTabChange={this.onModeChange}
        activeTab={mapModeToIndex(this.props.mode)}>
      </Pane>) : (<div className='modes-wrap'>
      {closeBtn}
      <Tabs className='modes'>
        <Tab index={0} onClick={tabClickNull}
          active={true}
          icon={labelMap[this.props.mode].icon}
          label={null}
        ></Tab>
        <Tab index={1} onClick={tabClickNull}
          icon={IconMoreHr}
          label={null}
        ></Tab>
      </Tabs>
    </div>
    );
    return (
      <section className={className('setting', this.props)}>
        <Collapsable label={labelMap[this.props.mode].label}
          headerContent={header}
          visible={this.props.visible}
          onToggle={this.onToggle}>
          <div className='setting-content'>{this.renderContent(this.props.mode)}</div>
        </Collapsable>
      </section>
    );
  }
}

Settings.propTypes = {
  constraints: PropTypes.object.isRequired,
  mode: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
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
  }

  render() {
    let {activeTab, contentBefore, contentAfter} = this.props;
    return (<div className={className('modes-wrap', this.props)}>
      {contentBefore}
      <Tabs activeTab={activeTab} className='modes'>{
        Object.keys(labelMap).map((key, i) => {
          let {...props} = labelMap[key];
          return (<Tab key={i} ref={'tab-' + (1 + i)} index={i} active={activeTab === i} onClick={this.onTabChange} {...props} ></Tab>)
        })
        }
      </Tabs>
      {contentAfter}
    </div>);
  }
}

Pane.propTypes = {
  activeTab: PropTypes.number,
  onTabChange: PropTypes.func.isRequired,
  contentBefore: PropTypes.node,
  contentAfter: PropTypes.node,
};

Pane.defaultProps = {
  activeTab: 0
};


class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state  = {};
    this.mode   = undefined;
  }

  updateState(props) {
    this.setState(assignFromObj(this.state, props));
  }

  update(prop, value) {
    let state = {};
    state[prop] = value;
    this.setState(state);
    setTimeout(() => {
      this.props.onChange(this.mode, this.state);
    }, 0);
  }

  componentWillMount() {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  render() {
    throw new Error('Did you forget to add a render method?');
  }
}

const sharedProps = {
  minW: PropTypes.number.isRequired,
  maxW: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

const commonProps = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  maxW: PropTypes.number.isRequired,
  maxH: PropTypes.number.isRequired,
};

const cropProps = {
  gravity: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9]).isRequired
};

Setting.propTypes = {
  ...sharedProps
};

export class Resize extends Setting {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null,
    };

    this.mode = MODES.IM_RESIZE;
  }


  render() {
    let {...props} = this.props;
    return (
      <EditResize key={ModeNames[this.mode]} width={this.state.width} height={this.state.height}
        {...props} type={1} onChange={this.update}
        labelWidth='W'
        labelHeight='H'
      />
    );
  }
}

Resize.propTypes = {
  ...sharedProps,
  ...commonProps
};

export class ResizeFit extends Resize {
  constructor(props) {
    super(props);
    this.mode = MODES.IM_RSIZEFIT;
  }
}

export class CropScale extends Resize {
  constructor(props) {
    super(props);
    this.mode = MODES.IM_SCALECROP;
    this.state.gravity = null;
  }

  renderChildren(props) {
    return null;
  }

  render() {
    let {...props} = this.props;
    return (
      <EditCrop key={ModeNames[this.mode]} width={this.state.width} height={this.state.height}
        gravity={this.state.gravity} {...props} type={this.mode} onChange={this.update}
          labelWidth='W'
          labelHeight='H'
        >
        {this.renderChildren(props)}
      </EditCrop>
    )
  }
}

CropScale.propTypes = {
  ...sharedProps,
  ...commonProps,
  ...cropProps
};

export class Crop extends CropScale {
  constructor(props) {
    super(props);
    this.mode = MODES.IM_CROP;
    this.state.background = null;
  }

  renderChildren(props) {
    let {colorMode, background} = props;
    return (
      <SelectGroup label='canvas color'>
        <ColorSelect hex={background} onChange={this.update} mode='RGB'>
        </ColorSelect>
      </SelectGroup>
    );
  }
}

Crop.propTypes = {
  ...sharedProps,
  ...commonProps,
  ...cropProps,
  background: PropTypes.string.isRequired
};

export class Scale extends Setting {
  constructor(props) {
    super(props);
    this.state = {
      width: null
    };
    this.mode = null;
  }

  componentWillReceiveProps(nextProps) {
    this.mode = nextProps.mode;
    Setting.prototype.componentWillReceiveProps.apply(this, arguments);
  }

  componentWillMount() {
    this.mode = this.props.mode;
    Setting.prototype.componentWillMount.apply(this, arguments);
  }

  render() {
    let {mode, steps, width, onUpdate, ...props} = this.props;

    if (!steps) {
      steps = Math.min(2, (this.props.maxW - this.props.minW) / 100);
    }

    let key = ModeNames[this.mode];

    return (
      <EditResizeScale
        key={key}
        steps={steps}
        type={this.mode}
        onChange={this.update}
        width={this.state.width}
        {...props}
      />
    );
  }
}

Scale.propTypes = {
  ...sharedProps,
  steps: PropTypes.number,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  mode: PropTypes.oneOf([
    MODES.IM_RSIZEPERCENT,
    MODES.IM_RSIZEPXCOUNT
  ]).isRequired
}

Scale.defaultProps = {
  unit: ''
};
