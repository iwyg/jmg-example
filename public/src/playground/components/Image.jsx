import React, {PropTypes} from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import {isFunc} from 'lib/assert';
import loadImage from 'lib/loadImage';

/**
 * class Figure
 */
export default class Figure extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };

    this.onLoaded = this.onLoaded.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  onLoaded(loaded) {
    this.setState({loaded: loaded});

    if (isFunc(this.props.onLoaded)) {
      this.props.onLoaded(loaded, this.refs.image);
    }
  }

  onLoad(src, promise) {
    promise.then(this.onLoaded);

    if (isFunc(this.props.onLoad)) {
      this.props.onLoad(src, promise);
    }

    this.setState({loaded: false});
  }

  render() {
    let {src, style, ref, ...props} = this.props;
    let isLoaded = this.state.loaded;
    let progress = isLoaded || !props.progress ? null :
      (<ProgressBar className='spinner loading' type='circular' mode='indeterminate'/>
    );

    return (
      <figure style={style} ref={ref}>
        <Image ref='image' src={src} {...props} onLoad={this.onLoad}/>
        {progress}
        <figcaption>{this.props.children}</figcaption>
      </figure>
    );
  }
}

Figure.propTypes = {
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  ref: PropTypes.string,
  progress: PropTypes.bool,
};

Figure.defaultProps = {
  style: {},
  progress: false
};

/**
 * class Image
 */
export class Image extends React.Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    loadingClass: PropTypes.string,
    loadedClass: PropTypes.string,
    onLoad: PropTypes.func,
    onLoaded: PropTypes.func
  }

  static defaultProps = {
    loadingClass: 'loading',
    loadedClass: 'loaded',
  }

  constructor(props) {
    super(props);
    this.className = null;
    this.state = {
      loaded: false,
      src: null,
      className: null
    };
  }

  imageDidLoad(loaded) {
    let {onLoaded} = this.props;
    isFunc(onLoaded) && onLoaded(loaded);
  }

  load(src) {
    let {onLoad} = this.props;

    let promise = loadImage(src);
    isFunc(onLoad) && onLoad(src, promise);

    promise.then(() => {
      this.setState({
        loaded: true,
        className: this.className + ' ' + this.props.loadedClass
      });

      this.imageDidLoad(this.state.loaded);

    }).catch(err => {
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
  }

  componentDidMount() {
    this.load(this.props.src);
  }

  render() {
    let {src, height, width} = this.props;
    return (
      <img src={src} height={height} width={width} className={this.state.className}/>
    );
  }
}
