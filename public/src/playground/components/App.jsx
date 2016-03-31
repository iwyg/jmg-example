import React, {PropTypes} from 'react';
import {Snackbar} from 'react-toolbox';
import {isFunc} from 'lib/assert';
import {connect} from 'react-redux';

import {
  fetchImages as getImages,
  fetchImage as getImage,
  selectQuery,
  selectImage,
  toggleGrid
} from 'playground/modules/actions';

import Panel from './Panel';
import Grid from './Grid';
import Preview from './Preview';
import {className} from 'lib/react-helper';
import MODES from 'playground/modules/modes';

const once = (fn, context = null) => {
  let called = false;

  return () => {
    if (called) {
      return;
    }
    called = true;
    return fn.apply(context, arguments);
  };
};

const snackbar = {
    active: false,
    type: 'accept',
    label: '',
    icon: null
};

class App extends React.Component {

  static propTypes = {
    defaults: PropTypes.object.isRequired,
    fetchingImage: PropTypes.bool.isRequired,
    fetchingImages: PropTypes.bool.isRequired,
    fetchImage: PropTypes.object.isRequired,
    fetchImages: PropTypes.object.isRequired,
    images: PropTypes.array.isRequired,
    limitImages: PropTypes.number
  }

  static defaultProps = {
    limitImages: 20
  }

  state = {
    grid: {
      initialized: false,
      size: null
    },

    snackbar: snackbar
  }

  toggleGrid = () => {
    let {dispatch, isSelectingImage} = this.props;
    dispatch(toggleGrid(isSelectingImage));
  }

  initializeGrid = once((nextProps, nextState) => {
    this.requestImages(this.getImagesQuery());
    let grid = Object.assign({}, this.state.grid, {initialized: true})
    this.setState({grid});
  })

  onGridResize = (size) => {
    let grid = Object.assign({}, this.state.grid, {size});
    this.setState({grid});
  }

  onSelectImage = (image) => {
    let {dispatch, imageParams} = this.props;

    if (this.props.isSelectingImage) {
      this.toggleGrid();
    }

    dispatch(selectImage(image.name, imageParams));
  }

  requestImage = (settings, dispatch = null) => {
    dispatch = dispatch || this.props.dispatch;
    dispatch(selectImage(this.props.image.name, settings));
  }

  requestImages(params, dispatch = null) {
    dispatch = dispatch || this.props.dispatch;
    dispatch(selectQuery(params));
  }

  getImagesQuery() {
    let mode = MODES.IM_RESIZE;
    let params = {};
    params[mode] = {
      width: this.state.grid.size,
      height: 0,
    };
    let setting = {
      mode: MODES.IM_RESIZE,
      params,
      filters: []
    };

    return [setting];
  }

  removeImage = () => {
    let {dispatch} = this.props;
    dispatch(selectImage(null));
  }

  handleFetchImages(nextProps, nextState) {
    let {dispatch, fetchImages, fetchingImages} = nextProps;

    if (fetchingImages || this.props.fetchingImages) {
      return;
    }

    dispatch(getImages(fetchImages.uri()));
  }

  handleFetchImage(nextProps, nextState) {
    let {dispatch, fetchImage, fetchingImage} = nextProps;

    if (fetchingImage || this.props.fetchingImage) {
      return;
    }

    if (fetchImage.uri === null) {
      dispatch(getImage(null));
    } else {
      dispatch(getImage(fetchImage.uri()));
    }
  }

  setSnackbar(props) {
    if (props.fetchError.error) {
      this.handleFetchError(props.fetchError.msg);
    } else {
      this.setState({snackbar});
    }
  }

  handleFetchError(msg) {
    this.setState({
      snackbar: {
        active: true, type: 'accept', label: msg.toString(), icon: '!'
      }
    });
  }

  componentWillReceiveProps(nextProps, nextState) {

    this.setSnackbar(nextProps);

    let {isSelectingImage, fetchImages, fetchImage} = nextProps;

    // fetch images
    if (fetchImages !== this.props.fetchImages ||
        (this.props.fetchError.error && nextProps.isSelectingImage)) {
      this.handleFetchImages(nextProps, nextState);
    }

    // fetch new image
    if (fetchImage !== this.props.fetchImage) {
      this.handleFetchImage(nextProps, nextState);
    }
  }

  componentDidUpdate(prevProps, prevState) {

    if (!prevState) {
      return;
    }

    if (this.state.grid.size !== prevState.grid.size) {
      this.requestImages(this.getImagesQuery(), this.props.dispatch);
    }
  }

  renderSnackbar() {
    const {...snacks} = this.state.snackbar;
    return (<Snackbar className='snackbar' {...snacks}></Snackbar>);
  }

  render() {

    const {image, images, defaults, fetchingImage, fetchingImages, isSelectingImage} = this.props;
    const imageLoaded = image ? true : false;

    return (
      <div className='layout-container'>
        <Panel className='settings' showProgress={fetchingImage} disabled={fetchingImage}
          onSelectImage={this.toggleGrid} onDeselectImage={this.removeImage} onApply={this.requestImage}
          selecting={this.props.isSelectingImage} image={this.props.image} constraints={defaults}
        />
        <div className='preview'>
          <Preview image={image}></Preview>
          <Grid onSelect={this.onSelectImage} onResize={this.onGridResize} visible={isSelectingImage}
            images={images} loading={fetchingImages} layout='masonry'
          >
          </Grid>
        </div>
        {this.renderSnackbar()}
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  let {
    gridVisible,
    fetchImages,
    fetchImage,
    fetchingImages,
    fetchingImage,
    fetchError,
    images,
    imageParams,
    image
  } = state;

  return {
    isSelectingImage: gridVisible,
    fetchImages,
    fetchImage,
    fetchingImages,
    fetchingImage,
    fetchError,
    images,
    imageParams,
    image
  };
};

export default connect(mapStateToProps)(App);
