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
}

EditGroup.propTypes = {
  type: PropTypes.number.isRequired
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

  render() {
    let {maxW, maxH, minW, minH} = this.props;
    return (
      <SelectGroup>
        <Slider onChange={this.onWidthChange} value={this.state.width} min={minW} stepped step={10} max={maxW}/>
        <Slider onChange={this.onHeightChange} value={this.state.height} min={minH} stepped step={10} max={maxH}/>
      </SelectGroup>
    );
  }
}

EditResize.propTypes = Object.assign({}, EditGroup.propTypes, {
  maxW: PropTypes.number.isRequired,
  maxW: PropTypes.number.isRequired,
  minH: PropTypes.number.isRequired,
  minH: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
});

EditResize.defaultProps = {
  type: MODES.IM_RESIZE
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
  }

  render() {
    let {maxW, maxH, minW, minH, gravity} = this.props;
    return (
      <SelectGroup>
        <Slider onChange={this.onWidthChange} value={this.state.width} min={minW} stepped step={10} max={maxW}/>
        <Slider onChange={this.onHeightChange} value={this.state.height} min={minH} stepped step={10} max={maxH}/>
        <GravitySelect selected={gravity}/>
      </SelectGroup>
    );
  }
}

EditCrop.propTypes = Object.assign({}, EditResize.propTypes, {
  gravity: PropTypes.number.isRequired
});

/**
 * EditResizeScale
 *
 * Edit group with a single slider.
 */
export class EditResizeScale extends EditCrop {
  constructor(props) {
    super(props);
    this.state = {
      width: null
    }

    this.onScaleChange = this.onChange.bind(this, 'width');
  }

  render() {
    let {maxW, minW, steps} = this.props;
    return (
      <SelectGroup>
        <Slider onChange={this.onScaleChange} value={this.state.width} min={minW} stepped step={steps} max={maxW}/>
      </SelectGroup>
    );
  }
}

EditResizeScale.propTypes = Object.assign({}, EditGroup.propTypes, {
  minW: PropTypes.number.isRequired,
  maxW: PropTypes.number.isRequired,
  steps: PropTypes.number.isRequired
});
