import React, {PropTypes} from 'react';

const GRAVITY = {
  1: 'top left',
  2: 'top center',
  3: 'top right',
  4: 'center left',
  5: 'center center',
  6: 'center right',
  7: 'bottom left',
  8: 'bottom center',
  9: 'bottom right',
};

export default class GravitySelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    }
  }

  componentWillMount()  {
    this.setState({selected: this.props.selected});
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.selected === this.state.selected) {
      return;
    }

    let {onChange} = nextProps;
    onChange && onChange(nextState.selected);
  }

  onSelect(selected, props) {
    this.setState({selected: selected});
  }

  render() {
    return (
      <div className="gravity-select">
        {Object.keys(GRAVITY).map((key, i) => {
        let k = parseInt(key);
        return (
          <GravitySelectItem
            value={k}
            selected={this.state.selected === k}
            onClick={this.onSelect.bind(this, k, this.props)}
            key={i}
            className={GRAVITY[key]}
          >
          </GravitySelectItem>
        );
        })}
      </div>
    );
  }
}

GravitySelect.propTypes = {
  selected: PropTypes.number.isRequired,
  onChange: PropTypes.func
};

GravitySelect.defaultProps = {
  selected: 5
};

class GravitySelectItem extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);

  }

  onClick() {
    let {onClick, value} = this.props;
    onClick && onClick(value);
  }

  render() {
    let cn = this.props.className || '';
    let className = this.props.selected ?  cn  + " " + this.props.activeClass : cn;
    return (
      <div className={className.trim()} onClick={this.onClick}></div>
    );
  }
}

GravitySelectItem.propTypes = {
  selected: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  activeClass: PropTypes.string
};

GravitySelectItem.defaultProps = {
  selected: false,
  activeClass: 'selected'
};

