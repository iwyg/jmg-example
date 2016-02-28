import React, {PropTypes} from 'react';
import Slider from 'react-toolbox/lib/slider';
import Color from 'color';

const channelToCompl = (c) => {
  return 255 - c;
};

const channelToHex = (c) => {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
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
      hex: 'f7f7f7',
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
      return;
    }
    this.setColor(hex);
  }

  render() {
    let {r, g, b} = this.state.rgb;
    let [cr, cg, cb] = mapCColor(this.state.rgb);
    let style = {
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
      color: `rgb(${cr}, ${cg}, ${cb})`
    };

    switch (this.props.mode) {
      case 'RGB':
        return (
          <div>
            <div className='color-preview' style={style}>#{this.state.hex}</div>
            <Slider className='channel-select' key={'red'}
              min={0} max={255} value={r} stepped step={1} onChange={this.setR}/>
            <Slider className='channel-select' key={'green'}
              min={0} max={255} value={g} stepped step={1} onChange={this.setG}/>
            <Slider className='channel-select' key={'blue'}
              min={0} max={255} value={b} stepped step={1} onChange={this.setB}/>
          </div>
      );
      case 'GRAY':
        return (
          <div>
            <div className='color-preview' style={style}>#{this.state.hex}</div>
            <Slider className='channel-select' key={'gray'}
              min={0} max={255} value={g} stepped step={1} onChange={this.setGray}/>
          </div>
        );
    }

    return null;
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
