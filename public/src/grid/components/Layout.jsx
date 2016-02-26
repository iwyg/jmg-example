import React, {PropTypes} from 'react';
import {fetchImages, selectOuery} from 'grid/modules/actions';
import MODES from 'grid/modules/modes';
import Toolbar, {ToolGroup, ValueSelect} from './Toolbar';
import Grid from './Grid';

const ModeMap = {
  [MODES.IM_NOSCALE]: 'pass through',
  [MODES.IM_RESIZE]: 'resize',
  [MODES.IM_SCALECROP]: 'scale an crop',
  [MODES.IM_CROP]: 'crop',
  [MODES.IM_RSIZEFIT]: 'best fit',
  [MODES.IM_RSIZEPERCENT]: 'scale',
  [MODES.IM_RSIZEPXCOUNT]: 'max pixel'
};

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

class ModeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.modes = Object.keys(MODES);
    this.state = {
      selected: null
    };

    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextState);
    return nextState.selected !== this.state.selected;
  }

  onChange(event) {
    let value = parseInt(event.target.value);
    this.setState({selected: value});
  }

  render() {
    return (
      <select onChange={this.onChange} disabled={this.props.disabled}>
        {this.modes.map((k, i) => {
          return (<option key= {i} value={MODES[k]}>{ModeMap[MODES[k]]}</option>);
        })}
      </select>
    );
  }
}

ModeSelect.propTypes = {
  disabled: PropTypes.bool.isRequired
};

ModeSelect.defaultProps = {
  disabled: false
};

Select.defaultProps = {
  disabled: false
};


export default class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.updateQueryFromSelect = this.updateQueryFromSelect.bind(this);
    this.updateQueryFromResize = this.updateQueryFromResize.bind(this);
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

  updateQueryFromSelect(value) {
    let q = {}
    this.props.dispatch(selectOuery(q));
  }

  render() {
    return (
      <div className="container">
        <Toolbar>
          <ToolGroup>
            <ValueSelect mode={2} />
          </ToolGroup>
        </Toolbar>
        <Grid
          images={this.props.images}
          onResize={this.updateQueryFromResize}
          captionKeys={['width', 'height', 'name', 'type', 'uri', 'hash']}
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
  limitImages: 20
};
