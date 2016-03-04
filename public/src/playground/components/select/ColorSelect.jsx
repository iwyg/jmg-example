import React, {PropTypes} from 'react';
import Slider from 'react-toolbox/lib/slider';
import Color from 'color';
import {ucFirst} from 'lib/string';

const channelToCompl = (c) => {
  return 255 - c;
};

const channelToHex = (c) => {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
};

const toHex = (channels) => {
  let hexMap = Object.values(channels).map(channelToHex);

  return hexMap.join('');
};

const getCColor = (c) => {
  //return c > 127 ? Math.min(c, 127) : Math.max(c, 255);
  return c > 127 ? Math.max(c - 255, 0) : Math.max(c - 255, 255);
};

const mapCColor = (channels)  => {
  return Object.values(channels).map(getCColor);
};


export default class ColorSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hex: null,
      rgb: {
        r: 127,
        g: 127,
        b: 127
      }
    }
    this.setR = this.onChange.bind(this, 'r');
    this.setG = this.onChange.bind(this, 'g');
    this.setB = this.onChange.bind(this, 'b');

    this.setGray = this.setGray.bind(this);
  }

  onChange(channel, value) {
    let state = Object.assign({}, this.state.rgb);
    let {onChange} = this.props;
    state[channel] = value;

    let hex = toHex(state);
    let newState = {rgb: state, hex: hex};
    this.setState(newState);

    onChange && onChange(newState);
  }

  setGray(color) {
    let rgb = {r: color, g: color, b: color};
    let newState = {rgb, hex: toHex(rgb)};
    let {onChange} = this.props;

    this.setState(newState);

    onChange && onChange(newState);
  }

  setColor(hexStr) {
    let hex = hexStr.trim('#');
    let rgb = Color('#'+hex).rgb();

    this.setState({hex: hex, rgb});
  }

  componentWillReceiveProps(nextProps, nextState) {
    let {hex, mode} = nextProps;

    if (mode !== this.props.mode && mode === 'GRAY') {
      hex = null !== hex ? hex : (null !== nextState.hex ? nextState.hex : this.state.hex);

      if (null !== hex) {
        let c = this.state.hex.substr(0, 2);
        hex = c+c+c;
      }
    }

    if (hex === null) {
      hex = '000000';
    }

    if (hex === this.state.hex) {
      return;
    }

    this.setColor(hex);
  }

  componentWillMount() {
    let {hex} = this.props;

    if (hex !== null) {
      this.setColor(toHex(this.state.rgb));
      return;
    }
    this.setColor(hex);
  }

  mapChannel(c) {
    let key = c === 'gray' ? 'r' : c;
    return this.state.rgb[key];
  }

  getStyle() {
    let {r, g, b} = this.state.rgb;
    let [cr, cg, cb] = mapCColor(this.state.rgb);

    return {
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
      color: `rgb(${cr}, ${cg}, ${cb})`
    };
  }

  render() {

    let mode = this.props.mode !== null ? this.props.mode.toLowerCase() : null;
    let channels = mode === 'rgb' ? Object.keys(this.state.rgb) : (mode === 'gray' ? [mode] : null);
    let cn = 'color-picker' + (this.props.className ? ' ' + this.props.className : '');

    if (!channels) {
      return null;
    }

    return (
      <div className={cn}>
        <div className='color-preview' style={this.getStyle()}>#{this.state.hex}</div>
        <div className='channels'>
          {channels.map((c, i) => {
            let updateFunc = ['set' + ucFirst(c)];
            console.log(updateFunc);
            let value = this.mapChannel(c);
            return (
              <div className='channel' key={'channel-'+c}>
                <span className='channel-name'>{c.toUpperCase()}</span>
                <Slider className='channel-select'
                  min={0} max={255} value={value} stepped step={1} onChange={this[updateFunc]}>
                </Slider>
                <span className='channel-value'>{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

ColorSelect.propTypes = {
  onChange: PropTypes.func,
  hex: PropTypes.string,
  mode: PropTypes.string
};

ColorSelect.defaultProps = {
  hex: null
};
