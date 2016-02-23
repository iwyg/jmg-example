import React, {PropTypes} from 'react';
import loaded from 'image-loaded';

export default class Figure extends React.Component {
  render() {
    let {src, ...props} = this.props;
    return (
      <figure>
        <Image src={src} {...props} />
        <figcaption></figcaption>
      </figure>
    );
  }
}

export class Image extends React.Component {
  constructor(props) {
    super(props);
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

  onLoad(err, wasLoaded) {
    console.log('load callback', wasLoaded);
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
    img.src = this.props.src;
    this.setState({className: this.className + ' ' + this.props.loadingClass});
    loaded(img, this.onLoad);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src === this.props) {
      return;
    }
  }

  componentWillMount() {
    this.className = this.props.className;
    this.image = document.createElement('img');
    //this.setState({src: this.props.src});
  }

  componentDidMount() {
    this.load();
  }

  render() {
    let {src, height, width} = this.props;
    return (
      <img src={src} height={height} width={width} className={this.state.className}></img>
    );
  }
}

Figure.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  loadingClass: PropTypes.string,
  loadedClass: PropTypes.string
};

Image.defaultProps = {
  loadingClass: 'loading',
  loadedClass: 'loaded'
};
