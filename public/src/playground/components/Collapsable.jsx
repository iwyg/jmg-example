import React, {PropTypes} from 'react';
import {className, callIfFunc} from 'lib/react-helper';
import {Icon, IconExpandLess, IconExpandMore} from './Icons';
import {IconButton} from 'react-toolbox/lib/button';

export default class Collapsable extends React.Component {

  constructor(props) {
    super(props);
    //this.state = {
    //  visible: true
    //};

    this.toggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      callIfFunc(this.props.onToggle, null, this.props.visible);
      //this.setState({visible: !this.state.visible});
    };
  }

  //componentDidUpdate(prevProps, prevState) {
  //  if (!prevState || prevState.visible !== this.state.visible) {
  //    callIfFunc(this.props.onToggle, null, this.state.visible);
  //  }
  //}

  updateState(props) {
    this.setState({visible: !props.collapsed})
  }

  //componentDidMount() {
  //  this.updateState(this.props);
  //}

  //componentWillReceiveProps(nextProps) {
  //  this.updateState(nextProps);
  //}

  renderHeader() {
    let Icn = this.props.visible ? this.props.iconOpen : this.props.iconCollapsed;
    let {label, hideLabel, headerContent} = this.props;
    let labelEl = hideLabel ? null : (<label>{label}</label>);
    let toggle = (<IconButton className='toggle'><Icn></Icn></IconButton>);
    let left = this.props.toggleLeft ? toggle : null;
    let right = this.props.toggleLeft ? null : toggle;
    return (
      <header onClick={this.toggle}>
        {left}
        {labelEl}
        {headerContent}
        {right}
      </header>
    );
  }

  renderChildren() {
    if (!this.props.visible) {
      return null;
    }
    return (<div className='collapsable-content'>{this.props.children}</div>);
  }

  render() {
    let cn = className(this.props.visible ? 'collapsable' : 'collapsable collapsed', this.props);
    return (
      <div className={cn}>
        {this.renderHeader()}
        {this.renderChildren()}
      </div>
    );
  }
}

Collapsable.propTypes = {
  label: PropTypes.string.isRequired,
  headerContent: PropTypes.node,
  hideLabel: PropTypes.bool,
  visible: PropTypes.bool,
  iconOpen: PropTypes.func,
  iconCollapsed: PropTypes.func,
  onToggle: PropTypes.func,
  toggleLeft: PropTypes.bool
};

Collapsable.defaultProps = {
  hideLabel: true,
  visible: true,
  iconOpen: IconExpandLess,
  iconCollapsed: IconExpandMore,
  toggleLeft: false
};
