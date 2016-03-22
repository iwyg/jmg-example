import React, {PropTypes} from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
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

//class LoadingBar extends React.Component {
//  render() {
//    let {...props} = this.props;
//    return this.props.visisble ? (<LinearProgress {...props}/>) : null;
//  }
//}

const progressBar = (fetching) => {
  return fetching ?
    (<ProgressBar className='grid-loading' type='circular' mode='indeterminate'/>) :
    null;
};

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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: {
        initialized: false,
        size: null
      },
      snackbar: {
        active: false,
        type: 'accept',
        label: '',
        icon: null
      },
    };

    this.toggleGrid = this.toggleGrid.bind(this);
    this.onGridResize = this.onGridResize.bind(this);
    this.initializeGrid = once(this.initializeGrid, this);
    this.onSelectImage = this.onSelectImage.bind(this);
    this.requestImage = this.requestImage.bind(this);
  }

  toggleGrid() {
    let {dispatch, isSelectingImage} = this.props;
    dispatch(toggleGrid(isSelectingImage));
  }

  requestImage(settings, dispatch = null) {
    dispatch = dispatch || this.props.dispatch;
    dispatch(selectImage(this.props.image.name, settings));
  }

  requestImages(params, dispatch = null) {
    dispatch = dispatch || this.props.dispatch;
    dispatch(selectQuery(params));
  }

  initializeGrid(nextProps, nextState) {
    this.requestImages(this.getImagesQuery());
    let grid = Object.assign({}, this.state.grid, {initialized: true})
    this.setState({grid: grid});
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

  onGridResize(size) {
    let grid = Object.assign({}, this.state.grid, {size});
    this.setState({grid});
  }

  onSelectImage(image) {
    let {dispatch, imageParams} = this.props;

    if (this.props.isSelectingImage) {
      this.toggleGrid();
    }

    dispatch(selectImage(image.name, imageParams));
  }

  fetchImage(params) {
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

    dispatch(getImage(fetchImage.uri()));
  }

  componentWillReceiveProps(nextProps, nextState) {
    let {isSelectingImage, fetchImages, fetchImage} = nextProps;

    // initialize grid
    //if (isSelectingImage) {
    //  this.initializeGrid(nextProps, nextState);
    //}

    // fetch images
    if (fetchImages !== this.props.fetchImages) {
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

  //componentDidUpdate(prevProps) {
  //  let {image} = prevProps;
  //  if (image !== this.props.image) {
  //    this.toggleGrid();
  //  }
  //}

  render() {
    let {...snacks} = this.state.snackbar;
    let imageLoaded = this.props.image ? true : false;
    return (
      <div className='layout-container'>
        <Panel
          className='settings'
          onSelectImage={this.toggleGrid}
          onApply={this.requestImage}
          selecting={this.props.isSelectingImage}
          image={this.props.image}
          constraints={this.props.defaults}
          disabled={this.props.fetchingImage}
          showProgress={this.props.fetchingImage}
        />
        <div className='preview'>
          <Preview image={this.props.image}>
          </Preview>
          <Grid onSelect={this.onSelectImage} onResize={this.onGridResize}
            visible={this.props.isSelectingImage} images={this.props.images}
            loading={this.props.fetchingImages}
            layout='masonry'
          >
          </Grid>
        </div>
        <Snackbar className='snackbar' {...snacks}/>
      </div>
    );
  }
}

App.propTypes = {
  defaults: PropTypes.object.isRequired,
  fetchingImage: PropTypes.bool.isRequired,
  fetchingImages: PropTypes.bool.isRequired,
  fetchImage: PropTypes.object.isRequired,
  fetchImages: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  limitImages: PropTypes.number
};

App.defaultProps = {
  limitImages: 20
};

const mapStateToProps = function (state) {
  let {
    gridVisible,
    fetchImages,
    fetchImage,
    fetchingImages,
    fetchingImage,
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
    images,
    imageParams,
    image
  };
};

export default connect(mapStateToProps)(App);
