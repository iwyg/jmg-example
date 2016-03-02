import React, {PropTypes} from 'react';
import Slider from 'react-toolbox/lib/slider';
import SelectGroup from './SelectGroup';
import GravitySelect from './GravitySelect';
import MODES from 'grid/modules/modes';

/**
 * EditGroup
 *
 * Abstract base component.
 */
class EditGroup extends React.Component {
  onChange(type, value) {
    let {onChange} = this.props;
    let state = {};
    state[type] = value;
    this.setState(state);

    onChange(type, value, this.props.type);
  }

  //componentWillReceiveProps(nextProps) {
  //  let state = {};
  //  Object.keys(this.state).forEach((key) => {
  //    if (nextProps.hasOwnProperty(key)) {
  //      state[key] = nextProps[key];
  //    }
  //  });

  //  this.setState(state);
  //}
}

EditGroup.propTypes = {
  type: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

/**
 * EditResize
 *
 * Edit group with two sliders.
 */
export class EditResize extends EditGroup {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null
    }

    this.onWidthChange = this.onChange.bind(this, 'width');
    this.onHeightChange = this.onChange.bind(this, 'height');
  }

  componentWillMount() {
    let {width, height} = this.props;
    this.setState({width, height});
  }

  render() {
    let {maxW, maxH, minW, minH} = this.props;
    return (
      <SelectGroup>
        <div className='slider'>
          <span className='slider-name'>{this.props.labelWidth}</span>
          <Slider className='slider-ctrl' onChange={this.onWidthChange} value={this.state.width} min={minW} stepped step={10} max={maxW}/>
          <span className='slider-value'>{this.state.width}{this.props.unit}</span>
        </div>
        <div className='slider'>
          <span className='slider-name'>{this.props.labelHeight}</span>
          <Slider className='slider-ctrl' onChange={this.onHeightChange} value={this.state.height} min={minH} stepped step={10} max={maxH}/>
          <span className='slider-value'>{this.state.height}{this.props.unit}</span>
        </div>
      </SelectGroup>
    );
  }
}

EditResize.propTypes = Object.assign({}, EditGroup.propTypes, {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  maxW: PropTypes.number.isRequired,
  maxW: PropTypes.number.isRequired,
  minH: PropTypes.number.isRequired,
  minH: PropTypes.number.isRequired,
  labelWidth: PropTypes.string,
  labelHeight: PropTypes.string,
  unit: PropTypes.string
});

EditResize.defaultProps = {
  type: MODES.IM_RESIZE,
  labelWidth: 'width',
  labelHeight: 'height',
  unit: ''
};


/**
 * EditCrop
 *
 * Edit group with two sliders and one gravity selector.
 */
export class EditCrop extends EditResize {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.state, {gravity: null});
    this.onGravityChange = this.onChange.bind(this, 'gravity');
  }

  componentWillMount() {
    let {gravity, width, height} = this.props;
    this.setState({gravity, width, height});
  }

  render() {
    let {maxW, maxH, minW, minH} = this.props;

    return (
      <SelectGroup>
        <div className='slider'>
          <span className='slider-name'>{this.props.labelWidth}</span>
          <Slider className='slider-ctrl' onChange={this.onWidthChange} value={this.state.width} min={minW} stepped step={10} max={maxW}/>
          <span className='slider-value'>{this.state.width}{this.props.unit}</span>
        </div>
        <div className='slider'>
          <span className='slider-name'>{this.props.labelHeight}</span>
          <Slider className='slider-ctrl' onChange={this.onHeightChange} value={this.state.height} min={minH} stepped step={10} max={maxH}/>
          <span className='slider-value'>{this.state.height}{this.props.unit}</span>
        </div>
        <div className="gravity">
          <GravitySelect selected={this.state.gravity} onChange={this.onGravityChange}/>
        </div>
        {this.props.children}
      </SelectGroup>
    );
  }
}

EditCrop.propTypes = Object.assign({}, EditResize.propTypes, {
  gravity: PropTypes.number.isRequired,
});

/**
 * EditResizeScale
 *
 * Edit group with a single slider.
 */
export class EditResizeScale extends EditGroup {
  constructor(props) {
    super(props);
    this.state = {
      width: null
    }

    this.onScaleChange = this.onChange.bind(this, 'width');
  }

  componentWillMount() {
    this.setState({width: this.props.start});
  }

  render() {
    let {maxW, minW, steps} = this.props;
    return (
      <SelectGroup>
        <div className='slider'>
          <span className='slider-name'>{this.props.label}</span>
          <Slider className='slider-ctrl' onChange={this.onScaleChange} value={this.state.width} min={minW} stepped step={steps} max={maxW}/>
          <span className='slider-value'>{this.state.width}{this.props.unit}</span>
        </div>
      </SelectGroup>
    );
  }
}

EditResizeScale.propTypes = Object.assign({}, EditGroup.propTypes, {
  start: PropTypes.number.isRequired,
  minW: PropTypes.number.isRequired,
  maxW: PropTypes.number.isRequired,
  steps: PropTypes.number.isRequired,
  label: PropTypes.string,
  unit: PropTypes.string
});

EditResizeScale.defaultProps = {
  label: 'scale',
  unit: '%'
};
