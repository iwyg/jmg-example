import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Image} from './Image';
import {selectImage, fetchImage as getImage} from 'grid/modules/actions';
import ValueSelect from './select/ValueSelect';
import ModeSelect from './select/ModeSelect';

export class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      mode: null,
      values: {}
    }

    this.onModeChange = this.onModeChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.onApply = this.onApply.bind(this);
  }

  onApply() {

    if (this.props.image === null) {
      return;
    }

    let {dispatch, image} = this.props;
    let {mode, values} = this.state
    let query = Object.assign({}, {mode}, values);

    dispatch(selectImage(image.name, query));
  }

  onModeChange(mode) {
    this.setState({mode: mode});
  }

  onValueChange(values) {
    this.setState({values: values});
  }

  componentWillUpdate(nextProps) {
    let {dispatch, fetchImage} = nextProps;

    if (fetchImage.uri === this.props.fetchImage.uri) {
      console.log('fooo');
      return;
    }


    dispatch(getImage(fetchImage.uri()));
  }

  componentWillMount() {
    this.setState({mode: this.props.mode || 0});
  }

  render() {
    let {mode} = this.state;
    let {className, image} = this.props;
    let preview = null;

    if (image !== null) {
      let {uri, ...props} = image;
      let icl = image.width > image.height ? 'landscape' : 'portrait';
      preview = (<Image className={icl} src={uri} {...props}/>)
    } else {
      className = (className +  ' empty').trim();
    }

    return (
      <div className={className}>
        <div className='settings'>
          <section className='mode-select'>
            <label>Select mode</label>
            <ModeSelect onChange={this.onModeChange} mode={mode}/>
          </section>
          <section className='value-select'>
            <label>Select values</label>
            <ValueSelect
              mode={this.state.mode || 0} maxW={1400} maxH={1400}
              color={image ? image.color : null}
              minW={100} minH={100}
              minPx={1000} maxPx={1000000}
              minScale={10} maxScale={200}
              onChange={this.onValueChange}
            />
          </section>
          <section className='value-apply'>
            <button onClick={this.onApply}>Apply</button>
          </section>
        </div>
        <div className='preview'> {preview} </div>
      </div>
    );
  }
}

Playground.propTypes = {
  image: PropTypes.object,
  mode: PropTypes.number.isRequired
};

const mapStateToProps = function (state) {
  const {fetchImage, fetching, image} = state;

  return {
    fetchImage,
    fetching,
    image
  };
};

export default connect(mapStateToProps)(Playground);
