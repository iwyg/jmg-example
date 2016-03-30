import debounce from 'lodash.debounce';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Masonry from 'react-masonry-component';
import Figure from './Image';
import {ButtonAdd} from './Buttons';
import {className} from 'lib/react-helper';
import {isFunc, isObject} from 'lib/assert';
import {CONTEXT} from 'runtime/constants';
import {callIfFunc} from 'lib/react-helper';
import ProgressBar from 'react-toolbox/lib/progress_bar';

const RESIZE = 'resize';

/* The image grid in all its glory */
export default class Grid extends React.Component {

	static propTypes = {
		images: PropTypes.array.isRequired,
		onResize: PropTypes.func,
		onSelect: PropTypes.func,
		onLayoutChange: PropTypes.func,
		captionKeys: PropTypes.array,
		visible: PropTypes.bool,
		loading: PropTypes.bool,
		layout: PropTypes.oneOf(['masonry', 'default'])
	}

	static defaultProps = {
		images: [],
		visible: false,
		loading: false,
		captionKeys: ['width', 'height'],
		layout: 'masonry'
	}

	state = {
		loaded: false,
		loadingImages: false,
		imagesLoaded: 0,
		maxWidth: null,
		layout: null,
	}

  constructor(props) {
    super(props);


    this.domNode = null;
    this.figures = [];
    this.loading = 0;

    this.onResize = debounce(this.updateMaxWidth.bind(this), 300);
  }

  onImageLoad = (src, promise) => {
    promise.then(() => {
      this.loading++;
    }).catch(() => {
      //this.loading++;
      console.log('error loading image.');
    });

    if (!this.state.loadingImages) {
      this.setState({loadingImages: true});
    }
  }

  onImageLoaded = (loaded, image) => {
    this.setState({imagesLoaded: this.loading});

    if (this.loading !== this.props.images.length) {
      return;
    }

    this.setState({loadingImages: false, imagesLoaded: 0});
    this.loading = 0;
  }

  // handles click events grid items
  handleClick = () => {
    let {onClick} = this.props;
    onClick && onClick.apply(null, arguments);
  }

  bindRefs = (item) => {
    this.figures.push(item.refs.figure);
  }

  updateMaxWidth() {
    let baseRef = this.refs['figure0'] || false;
    let ref = (baseRef && baseRef.refs) ? baseRef.refs.figure : (baseRef || false);
    let cwidth = this.domNode.clientWidth;
    let fwidth = !ref ? cwidth : ReactDOM.findDOMNode(ref).clientWidth;
    this.setState({maxWidth: fwidth});
  }

  componentWillUpdate(nextProps, nextState) {
    this.figures = [];

    if (!this.state.loaded && nextProps.images.length !== this.props.images.length) {
      this.setState({loaded: true});
    }
  }

  notifyIfnewSize(prevProps, prevState) {
    let {onResize, visible} = this.props;

    if ((visible && !prevProps.visible) || (visible && (prevState.maxWidth !== this.state.maxWidth))) {
      callIfFunc(this.props.onResize, null, this.state.maxWidth);
    }
  }

  componentDidUpdate(prevProps, prevState) {

    this.notifyIfnewSize(prevProps, prevState);

    if (!this.state.loaded) {
      return;
    }

    if (prevProps.images.length !== this.props.images.length) {
    // do specified stuff here
    }
  }

  componentDidMount() {
    this.domNode = ReactDOM.findDOMNode(this);
    setTimeout(() => {
      this.updateMaxWidth();
    }, 200);

    CONTEXT.addEventListener(RESIZE, this.onResize);
  }

  componentWillUnmount() {
    CONTEXT.removeEventListener(RESIZE, this.onResize);
    this.setState({loaded: false, maxWidth: null});

  }

  getClassName() {
    let baseClass = 'grid';
  }

  // render empty ref for max width calculation
  renderEmpty(gridClass, progress) {
    return (
      <div className={gridClass}>
        {progress}
        <div className='grid'>
          <div className='grid-item' ref='figure0'></div>
        </div>
      </div>
    );
  }

  /**
   * Renders a grid item.
   *
   * @return ReactElement
   */
  renderItem(image, key, keys, refStr, props) {
    return (
      <GridItem ref={refStr + key} refPrefix={refStr} image={image} onLoad={this.onImageLoad} onLoaded={this.onImageLoaded}
        onClick={this.props.onSelect} key={key} index={key} keys={keys} {...props} >
      </GridItem>
    );
  }

  renderItems(props) {
    let {captionKeys, images, ...rest} = props;
    let refStr = 'figure'

    return images.map((image, key) => {
      return this.renderItem(image, key, captionKeys, refStr, rest);
    })
  };

  renderLayout(layout, items, ...props) {
    if (this.state.loadingImages) {
      return null;
    }

		return (
			<GridLayout className='grid' layout={layout} {...props}>{items}</GridLayout>
		);
  }

  getProgress() {
    let props = this.state.loadingImages && this.loading > 0 ? {
      mode: 'determinate', value: (100 / Math.max(1, this.props.images.length)) * this.loading
    } : {mode: 'indeterminate'};

    return (<ProgressBar id="gsp" className='spinner loading' type='circular' {...props}/>);
  }

  /**
   * Render the grid.
   *
   * @return ReactElement
   */
  render() {
    let gridClass = className('grid-wrap', {className: this.props.visible ? 'visible' : undefined});
    let progress = null;

    if (this.props.loading || this.state.loadingImages) {
      gridClass += ' loading';
      progress = this.getProgress();
    }

    if (!this.state.loaded) {
      return this.renderEmpty(gridClass, progress);
    }

    let {layout, ...props} = this.props;

    return (
      <div className={gridClass}>
        {progress}
        {this.renderLayout(layout, this.renderItems(props), props)}
      </div>
    );
  }
}

/**
 * class GridItem
 * Wrapper component for the figure elements
 */
class GridItem extends React.Component {

	static propTypes = {
		image: PropTypes.object.isRequired,
		loading: PropTypes.bool,
		index: PropTypes.number.isRequired,
		keys: PropTypes.array,
		refPrefix: PropTypes.string,
		ref: PropTypes.string,
		onClick: PropTypes.func
	}

	static defaultProps = {
		onClick: null,
		loading: false
	}

  handleClick = () => {
    let {onClick, image} = this.props;
    callIfFunc(onClick, null, image, this.refs.figure);
  }

  render() {
    let {image, refPrefix, index, keys, ...rest} = this.props;

    return (
      <div className='grid-item'>
        <Figure src={image.uri} ref='figure' width={image.width} height={image.height} {...rest}>
          <div className='buttons'>
            <ButtonAdd onClick={this.handleClick}></ButtonAdd>
          </div>
          <div className='info'>
            {keys.map((key, i) => (<p className={key} key={i}><label>{key + ':'}</label>{image[key]}</p>))}
          </div>
          {this.props.children}
        </Figure>
      </div>
    );
  }
}

/**
 * GridLayout
 */
class GridLayout extends React.Component {

  static propTypes = {
		masonry: PropTypes.object,
    layout: PropTypes.oneOf(['default', 'masonry']).isRequired,
    children: PropTypes.any.isRequired
  }

  static defaultProps = {
    layout: 'default',
		masonry: {
			gutter: 0,
			resize: false,
			initLayout: false,
			transitionDuration: '0.4s',
		}
  }

	masonry = null

	bindMasonry = (ref) => {
    if (isObject(ref) && isObject(ref.masonry)) {
      if (ref.masonry === this.masonry) {
        this.masonry.off('layoutComplete', this.handleLayoutComplete);
        return;
      }
      this.masonry = ref.masonry;
      this.masonry.on('layoutComplete', this.handleLayoutComplete);
    } else {
      this.masonry = null;
    }
	}

  handleLayoutComplete(event) {
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.children.length !== this.props.children.length;
  }

	componentWillUnmount() {
    if (this.masonry !== null) {
      this.masonry.off('layoutComplete', this.handleLayoutComplete);
    }
	}

  componentDidUpdate(prevProps, prevState) {
    if (this.masonry) {
    	this.masonry.layout();
    }
	}

	renderMasonry() {
		let {...masonry} = this.props;
		return (
			<Masonry className={className('masonry', this.props)} options={masonry} ref={this.bindMasonry}>
				{this.props.children}
			</Masonry>
		);
	}

	renderDefault() {
    return (
			<div className={className('default', this.props)}>
				{this.props.children}
			</div>
		);
	}

  render() {
		let {layout} = this.props;

		return layout === 'masonry' ? this.renderMasonry() : this.renderDefault();
  }
}
