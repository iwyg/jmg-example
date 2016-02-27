import React, {PropTypes} from 'react';
import debounce from 'lodash.debounce';
import MODES from 'grid/modules/modes';
import SelectGroup from './SelectGroup';
import {EditCrop, EditResize, EditResizeScale} from './EditGroups';

const getInitialModes = () => {
  let modes = {};
  modes[MODES.IM_NOSCALE] = {width: null, height: null};
  modes[MODES.IM_RESIZE] = {width: null, height: null};
  modes[MODES.IM_SCALECROP] = {width: null, height: null, gravity: 5};
  modes[MODES.IM_CROP] = {width: null, height: null, gravity: 5};
  modes[MODES.IM_RSIZEFIT] = {width: null, height: null};
  modes[MODES.IM_RSIZEPERCENT] = {width: null};
  modes[MODES.IM_RSIZEPXCOUNT] = {width: null};

  return modes;
};

export default class ValueSelect extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {
      modes: getInitialModes()
    }

    this.onChange = debounce((type, value, modeType) => {
      console.log(type, value, modeType);
    }, 100);

  }

  getSliderValue(type, mode, value) {
    let m = Object.assign({}, this.state.modes);
    m[mode][type] = value;
    this.setState({modes: m});
    console.log(this.state);
  }

  render() {
    let {mode, maxPx, minPx, ...props} = this.props;
    let gravity = null;
    switch (this.props.mode) {
      case MODES.IM_NOSCALE:
        return (
          <SelectGroup>
          </SelectGroup>
        );
      case MODES.IM_RESIZE:
        return (
          <EditResize {...props} type={MODES.IM_RESIZE} onChange={this.onChange} minW={0} minH={0}/>
        );
      case MODES.IM_SCALECROP:
        gravity = this.state.modes[MODES.IM_SCALECROP].gravity;
        return (
          <EditCrop gravity={gravity} {...props} type={MODES.IM_SCALECROP} onChange={this.onChange}/>
        );

      case MODES.IM_CROP:
        gravity = this.state.modes[MODES.IM_CROP].gravity;
        return (
          <EditCrop gravity={gravity} {...props} type={MODES.IM_SCALECROP} onChange={this.onChange}/>
        );

      case MODES.IM_RSIZEFIT:
        return (
          <EditResize {...props} type={MODES.IM_RESIZE} onChange={this.onChange}/>
        );
      case MODES.IM_RSIZEPERCENT:
        return (
          <EditResizeScale maxW={1} minW={0.5} steps={0.1}/>
        );
      case MODES.IM_RSIZEPXCOUNT:
        return (
          <EditResizeScale maxW={maxPx} minW={minPx} steps={100}/>
        );
      default:
        return;
    };
  }
};

ValueSelect.propTypes = {
  mode: PropTypes.number.isRequired,
  maxW: PropTypes.number.isRequired,
  minW: PropTypes.number.isRequired,
  maxH: PropTypes.number.isRequired,
  minH: PropTypes.number.isRequired,
  maxPx: PropTypes.number.isRequired,
  minPx: PropTypes.number.isRequired
};

ValueSelect.defaultProps = {
  mode: MODES.IM_NOSCALE
};

