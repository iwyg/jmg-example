import {CONTEXT} from 'runtime/constants';
import debounce from 'lodash.debounce';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Masonry from 'react-masonry-component';
import Figure from './Image';
import {Button, IconButton} from 'react-toolbox/lib/button';

const RESIZE = 'resize';

/* The image grid in all its glory */
export default class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      maxWidth: null
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
    this.masonry = ref.masonry;
  }

  bindRefs(item) {
    this.figures.push(item.refs.figure);
  }

  updateMaxWidth() {
    let baseRef = this.refs['figure0'] || false;
    let ref = (baseRef && baseRef.refs) ? baseRef.refs.figure : (baseRef || false);
    let cwidth = this.domNode.clientWidth;
    let fwidth = !ref ? cwidth : ReactDOM.findDOMNode(ref).clientWidth;
    let resizeCallback = this.props.onResize;

    this.setState({maxWidth: fwidth});

    if (!resizeCallback) {
      return;
    }

    resizeCallback(this.state.maxWidth);
  }

  componentWillUpdate(nextProps) {
    this.figures = [];

    if (!this.state.loaded && nextProps.images.length !== this.props.images.length)  {
      this.setState({loaded: true});
    }
  }

  componentDidUpdate(nextProps) {
    if (!this.state.loaded) {
      return;
    }

    this.masonry.layout();

    if (nextProps.images.length !== this.props.images.length) {
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

  // render empty ref for max width calculation
  renderEmpty() {
    return (
      <div className='grid'>
        <div className='grid-item' ref='figure0'></div>
      </div>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderEmpty();
    }

    let {masonry, captionKeys, images, ...rest} = this.props;
    let refStr = 'figure'

    return (
      <Masonry className='grid' options={masonry} ref={this.bindMasonry}>{
        images.map((image, key) => {
          return (
            <GridItem
              ref={refStr + key} refPrefix={refStr} image={image}
              key={key} index={key} keys={captionKeys} {...rest}
            >
            </GridItem>
          );
        })
      }</Masonry>
    );
  }
}

/* Wrapper component for the figure elements */
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
        <div className="grid-item" >
          <Figure src={image.uri} ref='figure' width={image.width} height={image.height} {...rest}>
          <div className='buttons'>
            <Button icon='+' floating onClick={this.handleClick}></Button>
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

Grid.propTypes = {
  images: PropTypes.array.isRequired,
  rows: PropTypes.number,
  onResize: PropTypes.func,
  masonry: PropTypes.object,
  captionKeys: PropTypes.array
};

Grid.defaultProps = {
  images: [],
  rows: 3,
  masonry: {
    gutter: 0,
    resize: false,
    initLayout: false,
    transitionDuration: '0.4s',
  },
  captionKeys: ['width', 'height']
};

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
