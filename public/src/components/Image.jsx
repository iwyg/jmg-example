import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import loaded from 'image-loaded';

export default class Image extends Component {
  constructor() {
    super();
    this.className = null;
    this.onLoad = this.onLoad.bind(this);
    this.state = {
      src: null,
      className: null
    };
    this.image = null;
  }
  getImage() {
    return this.image;
  }
  onLoad(err, loaded) {
    console.log('load callback', arguments);
    if (err !== null) {
      this.onError(err);
      return;
    }

    this.setState({className: this.className + ' ' + this.props.loadedClass});
  }

  onError(err) {
    console.log(err);
  }

  load() {
    let img = this.getImage();
    img.src = this.state.src;
    this.setState({className: this.className + ' ' + this.props.loadingClass});
    loaded(img, this.onLoad);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.src === this.props) {
      return;
    }
  }
  componentWillMount() {
    console.log(arguments);
    console.log(this);
    this.className = this.props.className;
    this.image = document.createElement('img');
    this.setState({src: this.props.src});
  }
  componentDidMount() {
    this.load();
  }
  render() {
    let props = {
      src: this.state.src,
      className: this.state.className
    };
    return (
      <img {...props}></img>
    );
  }
}

Image.displayName = 'ImageComponent';
Image.propTypes = {
  src: PropTypes.string.isRequired,
  loadingClass: PropTypes.string,
  loadedClass: PropTypes.string
};

Image.defaultProps = {
  loadingClass: 'loading',
  loadedClass: 'loaded'
};
