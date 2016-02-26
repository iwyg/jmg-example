import {CONTEXT} from 'runtime/constants';
import debounce from 'lodash.debounce';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Masonry from 'react-masonry-component';
import Figure from './Image';

const RESIZE = 'resize';

/* render helper for grid children */
const renderFigure = (props, keys = [], ref = 'figure') => {
  let {images, ...rest} = props;
  return images.map((image, key) => {
    return (
      <GridItem image={image} key={key} ref={ref+key} keys={keys} {...rest} />
    );
  });
};

/* Wrapper component for the figure elements */
class GridItem extends React.Component {
  render() {
    let {image, ref, key, keys, ...rest} = this.props;
    return (
        <div className="grid-item">
          <Figure src={image.uri} ref={ref + key} width={image.width} height={image.height} {...rest}>
          <div>
            {keys.map((key, i) => (<p className={key} key={i}><label>{key + ':'}</label>{image[key]}</p>))}
          </div>
        </Figure>
        </div>
    );
  }
}

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

    this.onResize = debounce(this.updateMaxWidth.bind(this), 300);
    this.bindMasonry = this.bindMasonry.bind(this);
  }

  bindMasonry(ref) {
    this.masonry = ref.masonry;
  }

  updateMaxWidth() {
    let cwidth = this.domNode.clientWidth;
    let fwidth = !this.refs['figure0'] ? cwidth : ReactDOM.findDOMNode(this.refs.figure0).clientWidth;
    let resizeCallback = this.props.onResize;

    this.setState({maxWidth: fwidth});

    if (!resizeCallback) {
      return;
    }

    resizeCallback(this.state.maxWidth);
  }

  componentWillUpdate(nextProps) {
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
      <div className="grid">
        <div className="grid-item" ref="figure0"/>
      </div>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderEmpty();
    }

    //let keys = ['name', 'width', 'height', 'type', 'uri']
    let {masonry, captionKeys} = this.props;

    return (
      <Masonry className="grid" ref={this.bindMasonry} options={masonry}>
        {renderFigure(this.props, captionKeys, 'figure')}
      </Masonry>
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
