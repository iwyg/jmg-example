import React, {PropTypes} from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import MODES from 'grid/modules/modes';
import IconResize from 'icons/ic_photo_size_select_large_black_48px.svg';
import IconPass from 'icons/ic_photo_size_select_actual_black_48px.svg';
import IconScaleCrop from 'icons/ic_transform_black_48px.svg';
import IconCrop from 'icons/ic_crop_black_48px.svg';
import IconScale from 'icons/ic_image_aspect_ratio_black_48px.svg';
import IconFit from 'icons/ic_photo_size_select_large_black_48px.svg';
import IconPx from 'icons/ic_view_comfy_black_48px.svg';

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
        value: k,
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
    this.setState({selected: parseInt(mode)});
  }

  componentDidUpdate() {
    let {onChange} = this.props;
    onChange && onChange(this.state.selected);
  }

  componentWillMount() {
    this.setState({selected: this.props.mode});
  }

  item(item) {
    const getIcon = (mode) => {
      let m = parseInt(mode);
      switch (m) {
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
      <div className="mode-group-item">
        <div className="icon">{getIcon(item.value)}</div>
        <div className="label">{item.name}</div>
      </div>
    );
  }

  render() {
    return (
      <Dropdown className="mode-group" auto={false} onChange={this.onChange} source={this.modes}
        template={this.item} value={this.state.selected.toString()}
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
