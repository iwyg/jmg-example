import React, {PropTypes} from 'react';
import Grid from './Grid.jsx';
import {fetchImages, selectOuery} from '../modules/actions';

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

    this.props.update(this.state.value);
  }
  onChange(event) {
    this.setState({value: parseFloat(event.target.value)});
  }
  render() {
    return (
      <select onChange={this.onChange.bind(this)}>{this.state.values.map((value, key) => {
          return (<option value={value} key={key}>{value || '--'}</option>);
        })}
      </select>
    );
  }
}

Select.propTypes = {
  update: PropTypes.func.isRequired
};

export default class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.updateQueryFromSelect = this.updateQueryFromSelect.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.fetchUrl === this.props.fetchUrl) {
      console.log('no update');
      return;
    }

    console.log('layout update');

    let {dispatch, fetchUrl} = this.props;
    dispatch(fetchImages(fetchUrl.uri()));
  }

  componentDidMount() {
    let {dispatch, fetchUrl} = this.props;
    dispatch(fetchImages(fetchUrl.uri()));
  }

  componentWillReceiveProps(nextProps) {
    console.log('will receive props', arguments);
  }

  updateQueryFromSelect(value) {
    let q = {
      mode: 2,
      width:  value,
      gravity: 5
    };
    this.props.dispatch(selectOuery(q));
  }

  render() {
    //console.log('LAYOUT');
    //console.log(this.props.images);
    return (
      <div className="layout-container">
        <div className="mode-selector">
          <Select update={this.updateQueryFromSelect}/>
        </div>
        <Grid images={this.props.images}/>
      </div>
    );
  }
}

Layout.propTypes = {
  fetching: PropTypes.bool.isRequired,
  fetchUrl: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired
};
