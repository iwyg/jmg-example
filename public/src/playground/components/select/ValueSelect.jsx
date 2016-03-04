import React, {PropTypes} from 'react';
import debounce from 'lodash.debounce';
import MODES, {ModeNames, helper} from 'grid/modules/modes';
import SelectGroup from './SelectGroup';
import ColorSelect from './ColorSelect';
import {EditCrop, EditResize, EditResizeScale} from './EditGroups';

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

export default class ValueSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: null,
      modes: getInitialModes(props.minW, props.minH, props.minPx, props.minScale)
    }

    this.onChange = debounce(this.onValueChange.bind(this), 100);
    this.onColorChange = debounce(this.onColorChange.bind(this), 100);
  }


  onColorChange(color) {
    this.onValueChange('background', color.hex, MODES.IM_CROP);
  }

  onValueChange(type, value, mode) {
    let modes = Object.assign({}, this.state.modes);
    modes[mode][type] = value;
    modes[mode] = helper.validate(mode, modes[mode]);
    this.setState({modes: modes, mode: mode});

    let {onChange} = this.props;

    onChange && onChange(modes[mode]);
  }


  componentWillReceiveProps(nextProps) {
    this.setState({mode: nextProps.mode});
  }

  componentWillMount() {
    this.setState({mode: this.props.mode});
  }

  getMProp(type, mode = null) {
    let m = mode || this.state.mode;
    return this.state.modes[m][type];
  }

  getValueInfo(m) {
    return (
      <ul className="info">
        {Object.keys(this.state.modes[m]).map((type) => {
          return (<li key={m + type}><span>{type}</span><span>{this.state.modes[m][type]}</span></li>);
        })}
      </ul>
    );
  }

  getColorPicker(mode) {
    if (mode !== MODES.IM_CROP) {
      return null;
    }

    return (
      <SelectGroup label='canvas color'>
        <ColorSelect hex={this.getMProp('background')} onChange={this.onColorChange} mode={this.props.color}/>
      </SelectGroup>
    );
  }

  render() {
    let {mode, maxPx, minPx, ...props} = this.props;
    let m = this.state.mode;
    switch (m) {
      case MODES.IM_RESIZE:
        return (
          <EditResize key={ModeNames[m]} width={this.getMProp('width')} height={this.getMProp('width')}
            {...props} type={m} onChange={this.onChange} minW={0} minH={0}
            labelWidth='W'
            labelHeight='H'
          />
        );
      case MODES.IM_SCALECROP:
      case MODES.IM_CROP:
        return (
            <EditCrop key={ModeNames[m]} width={this.getMProp('width')} height={this.getMProp('height')}
              gravity={this.getMProp('gravity')} {...props} type={m} onChange={this.onChange}
                labelWidth='W'
                labelHeight='H'
              >
              {this.getColorPicker(m)}
            </EditCrop>
        );
      case MODES.IM_RSIZEFIT:
        return (
          <EditResize key={ModeNames[m]} width={this.getMProp('width')} height={this.getMProp('height')}
            {...props} type={m} onChange={this.onChange}
            labelWidth='Max W'
            labelHeight='Max H'
          />
        );
      case MODES.IM_RSIZEPERCENT:
        return (
          <EditResizeScale key={ModeNames[m]} start={this.getMProp('width')} maxW={this.props.maxScale}
            minW={this.props.minScale} steps={10} type={m} onChange={this.onChange}
            label='scale' unit='%'
          />
        );
      case MODES.IM_RSIZEPXCOUNT:
        return (
          <EditResizeScale key={ModeNames[m]} start={this.getMProp('width') || parseInt(maxPx / 2)} maxW={maxPx} minW={minPx}
            steps={100} type={m} onChange={this.onChange}
            label='px' unit=''
          />
        );
      case MODES.IM_NOSCALE:
      default:
        return null;
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
  minPx: PropTypes.number.isRequired,
  maxScale: PropTypes.number.isRequired,
  minScale: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  color: PropTypes.string
};

ValueSelect.defaultProps = {
  mode: MODES.IM_NOSCALE,
  color: null
};

