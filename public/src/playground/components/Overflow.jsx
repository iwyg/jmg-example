import ReactDOM from 'react-dom';
import React, {PropTypes} from 'react';
import {onUnderflow, onOverflow} from 'lib/events';
import {callIfFunc, classNames} from 'lib/react-helper';

export default class Overflow extends React.Component {

  static propTypes = {
    overflowClass: PropTypes.string,
    onOverflow: PropTypes.func,
    onUnderflow: PropTypes.func,
    elementName: PropTypes.string
  }

  static defaultProps = {
    elementName: 'div',
    overflowClass: 'overflow'
  }

  state = {
    overflown: false
  }

  onOverflow = (event) => {
    this.setState({overflow: true});
    callIfFunc(this.props.onOverflow, null, event);
  }

  onUnderflow = (event) => {
    this.setState({overflow: false});
    callIfFunc(this.props.onUnderflow, null, event);
  }

  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    this._rmOnOverflow = onOverflow(el, this.onOverflow);
    this._rmOnUnderflow = onUnderflow(el, this.onUnderflow);
  }

  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this);
    this._rmOnOverflow(el);
    this._rmOnUnderflow(el);
  }

  render() {
    let {overflowClass, elementName, ...props} = this.props;
    let El = elementName;

    return (
      <El className={classNames({[overflowClass] : this.state.overflown})} {...props}>
        {this.props.children}
      </El>
   );
  }
};
