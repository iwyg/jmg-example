export const ToolGroup = ({children}) => {
  return (<div className="tool-group">{children}</div>);
}



export class ValueSelect extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {
      modes: getInitialModes()
    }

  }
  getSliderValue(type, mode, value) {
    let m = Object.assign({}, this.state.modes);
    m[mode][type] = value;
    this.setState({modes: m});
    console.log(this.state);
  }
  render() {
    switch (this.props.mode) {
      case MODES.IM_NOSCALE:
        return (
          <SelectGroup>
            <Slider min={0} max={800}/>
            <Slider min={0} max={800}/>
          </SelectGroup>
        );
      case MODES.IM_RESIZE:
        return (
          <SelectGroup>
            <Slider min={0} max={800}/>
            <Slider min={0} max={800}/>
          </SelectGroup>
        );
      case MODES.IM_SCALECROP:
        var gravity = this.state.modes[MODES.IM_SCALECROP].gravity;
        var valueW = this.state.modes[MODES.IM_SCALECROP].width;
        var valueH = this.state.modes[MODES.IM_SCALECROP].height;
        return (
          <SelectGroup>
            <GravitySelect selected={gravity}/>
            <Slider onChange={this.getSliderValue.bind(this, 'width', MODES.IM_SCALECROP)} value={valueW} min={0} stepped step={1} max={10}/>
            <Slider onChange={this.getSliderValue.bind(this, 'height', MODES.IM_SCALECROP)} value={valueH} min={0} stepped step={1} max={10}/>
          </SelectGroup>
        );

      case MODES.IM_CROP:
        return (
          <SelectGroup>
            <GravitySelect selected={5}/>
          </SelectGroup>
        );

      case MODES.IM_RSIZEFIT:
        return (
          <SelectGroup>
            <GravitySelect selected={5}/>
          </SelectGroup>
        );
      case MODES.IM_RSIZEPERCENT:
        return (
          <SelectGroup>
            <Slider min={0.1} max={1}/>
          </SelectGroup>
        );
      case MODES.IM_RSIZEPXCOUNT:
        return (
          <SelectGroup>
            <Slider min={4000} max={400000}/>
          </SelectGroup>
        );
      default:
        return;
    };
  }
};

//export class SelectGroup extends React.Component {
//  render() {
//    return (
//      <div className="select-group">
//        {this.props.children}
//      </div>
//    );
//  }
//}


ValueSelect.propTypes = {
  mode: PropTypes.number.isRequired
};

ValueSelect.defaultProps = {
  mode: MODES.IM_NOSCALE
};

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {...props} = this.props;
    return (
      <div {...props}>{this.props.children}</div>
    );
  }
}
