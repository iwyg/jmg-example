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

class Select extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      values: [null, 150, 200, 250, 400, 600],
      value: null
    };
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevState.value === this.state.value) {
      return;
    }

    let {update} = this.props;

    update(this.state.value);
  }
  onChange(event) {
    let value = event.target.value;
    let parsedValue = parseFloat(value) || null;
    if (parsedValue === this.state.value) {
      console.log('ON_CHANGE_NO_UPDATE');
      return false;
    }

    console.log('ON_CHANGE_UPDATE');

    this.setState({value: parsedValue});

    return true;
  }

  render() {
    return (
      <select onChange={this.onChange.bind(this)} disabled={this.props.disabled}>
        {this.state.values.map((value, key) => {
          return (<option value={value || null} key={key}>{ value ? `value is ${value}` : '--'}</option>);
        })}
      </select>
    );
  }
}

Select.propTypes = {
  update: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};


Select.defaultProps = {
  disabled: false
};


export default class Layout extends React.Component {

  constructor(props) {
    super(props);
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
      console.log('no update');
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
    let query = {
      mode: MODES.IM_RESIZE,
      width: maxWidth,
      height: 0,
      limit: limitImages
    };

    dispatch(selectOuery(query));
  }

  handleImageSelect(meta, figure) {
    let {name} = meta;

    console.log(name);
    this.props.dispatch(selectImage(name));
  }

  updateQueryFromSelect(value) {
    let q = {}
    this.props.dispatch(selectOuery(q));
  }

  render() {
    return (
      <div className='layout-container'>
        <Playground className='playground' mode={0}/>
        <Grid images={this.props.images} onResize={this.updateQueryFromResize}
          onClick={this.handleImageSelect} captionKeys={['width', 'height', 'name', 'type', 'uri', 'hash', 'color']}
        />
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
