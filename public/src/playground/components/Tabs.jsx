import React, {PropTypes} from 'react';
import {className, callIfFunc} from 'lib/react-helper';
import {TooltipIcon, Icon} from './Icons';

export class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.tabs = [];
    this.state = {
      index: 0
    };
  }

  componentDidMount() {
    console.log('TABS', this);
  }

  findTabs(children) {
    return React.Children.toArray(children).filter((c) => {
      return c.type === Tab || c.type.prototype.constructor === Tab;
    });
  }

  componentWillUpdate(nextProps)  {
    this.tabs = this.findTabs(nextProps.children);
    console.log(this.tabs);
  }

  render() {
    return (
      <ul className={className('tabs', this.props)}>
        {this.props.children}
      </ul>
    );
  }
}

export class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.willBeActive = this.willBeActive.bind(this);
  }

  willBeActive(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.active) {
      return;
    }

    callIfFunc(this.props.onClick, null, this.props.index);
  }

  renderLabel() {
    let {label, iconOnly} = this.props;
    let MyIcon = this.props.icon;

    if (iconOnly) {
      let ShowIcon = null !== this.label ? (
          <TooltipIcon flat={true} tooltip={label}>
            <MyIcon/>
          </TooltipIcon>
      ) : (<Icon><MyIcon/></Icon>);
      return (
        <label>
          {ShowIcon}
        </label>
      );
    }

    return (
      <label>
        <span className='icon'>
          <Icon>
            <MyIcon/>
          </Icon>
        </span>{label}
      </label>
    );
  }

  render() {
    let label = this.renderLabel();
    return (
      <li onClick={this.willBeActive} className={className('tab', this.props) + (this.props.active ? ' active' : '')}>
        {label}
      </li>
    );
  }
}

Tab.propTypes = {
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.func,
  label: PropTypes.string,
  iconOnly: PropTypes.bool
};

Tab.defaultProps = {
  active: false,
  iconOnly: true
};
