import debounce from 'lodash.debounce';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Masonry from 'react-masonry-component';
import Figure from './Image';
import {ButtonAdd} from './Buttons';
import {className} from 'lib/react-helper';
import {isFunc, isObject} from 'lib/assert';
import IconMasonry from 'ic_dashboard_black_24px.svg';
import {CONTEXT} from 'runtime/constants';
import {callIfFunc} from 'lib/react-helper';

const RESIZE = 'resize';


/* The image grid in all its glory */
export default class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      maxWidth: null,
      layout: null,
    }

    this.domNode = null;
    this.masonry = null;
    this.figures = [];

    this.onResize = debounce(this.updateMaxWidth.bind(this), 300);
    this.bindMasonry = this.bindMasonry.bind(this);
    this.bindRefs = this.bindRefs.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // handles click events grid items
  handleClick() {
    let {onClick} = this.props;
    onClick && onClick.apply(null, arguments);
  }

  bindMasonry(ref) {
    if (isObject(ref)) {
      this.masonry = ref.masonry;
    } else {
      this.masonry = null;
    }
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
      this.masonry.layout();
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
  renderEmpty(gridClass) {
    return (
      <div className={gridClass}>
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
    //let {...props} = props;
    return (
      <GridItem ref={refStr + key} refPrefix={refStr} image={image}
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

  /**
   * Render the grid.
   *
   * @return ReactElement
   */
  render() {
    let gridClass = className('grid-wrap', {className: this.props.visible ? 'visible' : undefined});

    if (!this.state.loaded) {
      return this.renderEmpty(gridClass);
    }

    let {layout, masonry, ...props} = this.props;
    const items = this.renderItems(props);

    return (
      <div className={gridClass}>
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
  layout: PropTypes.oneOf(['masonry', 'default'])
};

Grid.defaultProps = {
  images: [],
  visible: false,
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
  index: PropTypes.number.isRequired,
  keys: PropTypes.array,
  refPrefix: PropTypes.string,
  ref: PropTypes.string,
  onClick: PropTypes.func
};

GridItem.defaultProps = {
  onClick: null
};
