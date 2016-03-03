import React, {PropTypes} from 'react';
import {fetchImages, selectOuery, selectImage} from 'grid/modules/actions';
import MODES from 'grid/modules/modes';
import Grid from './Grid';
import Playground from './Playground';

class LoadingBar extends React.Component {
  render() {
    let {...props} = this.props;
    return this.props.visisble ? (<LinearProgress {...props}/>) : null;
  }
}

const requestGridImages = (dispatch, maxWidth, limit, layout) => {
  let query;
  if (layout === 'masonry') {
    query = {
      mode: MODES.IM_RESIZE,
      width: maxWidth,
      height: 0,
      limit: limit
    };
  } else {
    query = {
      mode: MODES.IM_SCALECROP,
      width: maxWidth,
      height: maxWidth,
      gravity: 5,
      limit: limit
    };
  }

  dispatch(selectOuery(query));
};

export default class Layout extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      gridLayout: 'masonry'
    };

    this.updateQueryFromSelect = this.updateQueryFromSelect.bind(this);
    this.updateQueryFromResize = this.updateQueryFromResize.bind(this);
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

  updateQueryFromResize(maxWidth) {
    let {dispatch, limitImages} = this.props;

    requestGridImages(dispatch, maxWidth, limitImages, this.state.gridLayout);
  }

  handleImageSelect(meta, figure) {
    let {name} = meta;

    this.props.dispatch(selectImage(name));
  }

  updateQueryFromSelect(value) {
    let q = {}
    this.props.dispatch(selectOuery(q));
  }

  render() {
    let layout = this.state.gridLayout;
    return (
      <div className='layout-container'>
        <Playground className='playground' mode={0}>
          <div className='grid-wrap'>
            <Grid
              images={this.props.images}
              onResize={this.updateQueryFromResize}
              onClick={this.handleImageSelect}
              onLayoutChange={this.updateQueryFromLayout}
              layout={layout}
              captionKeys={['width', 'height']}
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
  limitImages: 30
};
