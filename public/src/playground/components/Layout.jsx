import React, {PropTypes} from 'react';
import {fetchImages, selectQuery, selectImage} from 'playground/modules/actions';
import MODES from 'playground/modules/modes';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Grid from './Grid';
import Playground from './Playground';

class LoadingBar extends React.Component {
  render() {
    let {...props} = this.props;
    return this.props.visisble ? (<LinearProgress {...props}/>) : null;
  }
}

export default class Layout extends React.Component {

  constructor(props) {
    super(props);

    this.handleGridResize = this.handleGridResize.bind(this);
    this.handleImageSelect = this.handleImageSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fetching) {
      return;
    }

    if (typeof nextProps.fetchUrl.uri !== 'function') {
      return;
    }

    let nextUrl = nextProps.fetchUrl.uri();
    let currentUrl = this.props.fetchUrl.uri();

    if (currentUrl === nextUrl) {
      return;
    }

    let {dispatch} = nextProps;
    dispatch(fetchImages(nextUrl));
  }

  componentDidMount() {
    //let {dispatch, fetchUrl} = this.props;
    //dispatch(fetchImages(fetchUrl.uri()));
  }

  /**
   * Dispatches the request for images in grid.
   */
  handleGridResize(newWidth) {
    let {dispatch, limitImages} = this.props;

    let query = {
      mode: MODES.IM_RESIZE,
      width: newWidth,
      height: 0,
      limit: limitImages
    };

    console.log(query);

    dispatch(selectQuery(query));
  }

  /**
   * Dispatches the request for a single image to be loaded.
   */
  handleImageSelect(meta, figure) {
    let {name} = meta;

    this.props.dispatch(selectImage(name));
  }

  render() {
    const progressBar = (fetching) => {
      return fetching ?
        (<ProgressBar className='grid-loading' type='circular' mode='indeterminate'/>) :
        null;
    };

    return (
      <div className='layout-container'>
        <Playground className='playground' mode={0}>
          <div className='grid-wrap'>
            {progressBar(this.props.fetching)}
            <Grid images={this.props.images} captionKeys={['width', 'height']}
              onResize={this.handleGridResize}
              onClick={this.handleImageSelect}
            />
          </div>
        </Playground>
      </div>
    );
  }
}

Layout.propTypes = {
  fetching: PropTypes.bool.isRequired,
  fetchUrl: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  limitImages: PropTypes.number
};

Layout.defaultProps = {
  limitImages: 20
};
