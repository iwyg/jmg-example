import React, {PropTypes} from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import MODES from 'grid/modules/modes';
import IconResize from 'icons/resize-10.svg';
import IconPass from 'icons/fullscreen-12.svg';
import IconScaleCrop from 'icons/crop-3.svg';
import IconCrop from 'icons/crop-1.svg';
import IconScale from 'icons/fullscreen-11.svg';
import IconFit from 'icons/resize-9.svg';
import IconPx from 'icons/resize-9.svg';

const ModeMap = {
  [MODES.IM_NOSCALE]: 'pass through',
  [MODES.IM_RESIZE]: 'resize',
  [MODES.IM_SCALECROP]: 'scale an crop',
  [MODES.IM_CROP]: 'crop',
  [MODES.IM_RSIZEFIT]: 'best fit',
  [MODES.IM_RSIZEPERCENT]: 'scale',
  [MODES.IM_RSIZEPXCOUNT]: 'max pixel'
};

export default class ModeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.modes = Object.keys(MODES);
    this.state = {
      selected: null,
      modes: ModeMap
    };

    this.modes = Object.keys(ModeMap).map((k) => {
      return {
        value: parseInt(k),
        name: ModeMap[k]
      };
    });

    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.selected !== this.state.selected;
  }

  componentWillUpdate(nextProps, nextState) {
    let {onChange} = nextProps;
    onChange && onChange(nextState.selected);
  }

  onChange(mode) {
    this.setState({selected: mode});
  }

  componentDidUpdate() {
    let {onChange} = this.props;
    onChange && onChange(this.state.selected);
  }

  item(item) {
    const getIcon = (mode) => {
      console.log(mode)
      switch (mode) {
        case 1:
        return (<IconResize/>);
        case 2:
        return (<IconScaleCrop/>);
        case 3:
        return (<IconCrop/>);
        case 4:
        return (<IconFit/>);
        case 5:
        return (<IconScale/>);
        case 4:
        return (<IconPx/>);
      }

      return (<IconPass/>);
    };

    return (
      <div>
        <div className="icon">{getIcon(item.value)}</div>
        <div className="label">{item.name}</div>
      </div>
    );
  }

  render() {
    return (
      <Dropdown auto={false} onChange={this.onChange} source={this.modes}
        template={this.item} value={this.state.selected}
      >
      </Dropdown>
    );
  }
}

ModeSelect.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func
};

ModeSelect.defaultProps = {
  disabled: false
};
