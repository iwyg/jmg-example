import React, {PropTypes} from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import {isFunc} from 'lib/assert';
import loadImage from 'lib/loadImage';

export default class Figure extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };

    this.onLoaded = this.onLoaded.bind(this);
  }

  onLoaded(loaded) {

    if (loaded === this.state.loaded) {
      return;
    }

    this.setState({loaded: loaded});
  }

  render() {
    let {src, style, ref, ...props} = this.props;
    let isLoaded = this.state.loaded;
    return (
      <figure style={style} ref={ref}>
        <Image ref='image' src={src} {...props} onLoaded={this.onLoaded}/>
        {
          (function() {
            return isLoaded ? null : (
              <ProgressBar className='loading' type='circular' mode='indeterminate' />
            )
          }())
        }
        <figcaption>{this.props.children}</figcaption>
      </figure>
    );
  }
}

export class Image extends React.Component {
  constructor(props) {
    super(props);
    this.className = null;
    this.state = {
      loaded: false,
      src: null,
      className: null
    };
    this.image = null;
  }

  imageDidLoad(loaded) {
    let {onLoaded} = this.props;
    isFunc(onLoaded) && onLoaded(loaded);
  }

  getImage() {
    return this.image;
  }

  load(src) {
    let {onLoad} = this.props;
    isFunc(onLoad) && onLoad(src);

    loadImage(src).then(() => {
      this.setState({
        loaded: true,
        className: this.className + ' ' + this.props.loadedClass
      });

      this.imageDidLoad(this.state.loaded);

    }).catch((err) => {
        throw new Error(err);
        this.imageDidLoad(false);
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src === this.props.src) {
      return;
    }

    this.setState({loaded: false, className: this.className + ' ' + this.props.loadingClass});
    this.load(nextProps.src);
  }

  isLoaded() {
    return this.state.loaded;
  }

  componentWillMount() {
    this.className = this.props.className;
    this.image = document.createElement('img');
    //this.setState({src: this.props.src});
  }

  componentDidMount() {
    this.load(this.props.src);

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
  style: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  ref: PropTypes.string
};

Figure.defaultProps = {
  style: {},
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  loadingClass: PropTypes.string,
  loadedClass: PropTypes.string,
  onLoad: PropTypes.func,
  onLoaded: PropTypes.func
};

Image.defaultProps = {
  loadingClass: 'loading',
  loadedClass: 'loaded'
};
