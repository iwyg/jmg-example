import debounce from 'lodash.debounce';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Masonry from 'react-masonry-component';
import Figure from './Image';
import {ButtonAdd} from './Buttons';
import {className} from 'lib/react-helper';
import {isFunc, isObject} from 'lib/assert';
import IconMasonry from 'ic_dashboard_black_48px.svg';
import {CONTEXT} from 'runtime/constants';
import {callIfFunc} from 'lib/react-helper';
import ProgressBar from 'react-toolbox/lib/progress_bar';

const RESIZE = 'resize';


/* The image grid in all its glory */
export default class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      loadingImages: false,
      imagesLoaded: 0,
      maxWidth: null,
      layout: null,
    }

    this.domNode = null;
    this.masonry = null;
    this.figures = [];
    this.loading = 0;

    this.bindMasonry = this.bindMasonry.bind(this);
    this.bindRefs = this.bindRefs.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onResize = debounce(this.updateMaxWidth.bind(this), 300);
    this.handleLayoutComplete = debounce(this.handleLayoutComplete.bind(this), 100);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
  }

  onImageLoad(src, promise) {
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

  onImageLoaded(loaded, image) {
    this.setState({imagesLoaded: this.loading});

    if (this.loading !== this.props.images.length) {
      return;
    }

    this.setState({loadingImages: false, imagesLoaded: 0});
    this.loading = 0;
  }

  // handles click events grid items
  handleClick() {
    let {onClick} = this.props;
    onClick && onClick.apply(null, arguments);
  }

  bindMasonry(ref) {
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

  bindRefs(item) {
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

    if (this.masonry) {
      //this.masonry.layout();
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

    if (this.masonry !== null) {
      this.masonry.off('layoutComplete', this.handleLayoutComplete);
    }
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

  renderLayout(layout, items, masonry = {}) {
    switch (layout) {
      case 'masonry':
        return (
          <Masonry className='grid' options={masonry} ref={this.bindMasonry}>
            {items}
          </Masonry>
        );
      default:
        return (
          <div className='grid'>
            {items}
          </div>
        );
    }
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

    let {layout, masonry, ...props} = this.props;
    const items = this.renderItems(props);

    return (
      <div className={gridClass}>
        {progress}
        {this.renderLayout(layout, items, masonry)}
      </div>
    );
  }
}

Grid.propTypes = {
  images: PropTypes.array.isRequired,
  onResize: PropTypes.func,
  onSelect: PropTypes.func,
  onLayoutChange: PropTypes.func,
  masonry: PropTypes.object,
  captionKeys: PropTypes.array,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  layout: PropTypes.oneOf(['masonry', 'default'])
};

Grid.defaultProps = {
  images: [],
  visible: false,
  loading: false,
  masonry: {
    gutter: 0,
    resize: false,
    initLayout: false,
    transitionDuration: '0.4s',
  },
  captionKeys: ['width', 'height'],
  layout: 'masonry'
};

/**
 * class GridItem
 * Wrapper component for the figure elements
 */
class GridItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick  = this.handleClick.bind(this);

  }

  handleClick() {
    let {onClick, image} = this.props;
    onClick && onClick(image, this.refs.figure);
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

GridItem.propTypes = {
  image: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  index: PropTypes.number.isRequired,
  keys: PropTypes.array,
  refPrefix: PropTypes.string,
  ref: PropTypes.string,
  onClick: PropTypes.func
};

GridItem.defaultProps = {
  onClick: null,
  loading: false
};
