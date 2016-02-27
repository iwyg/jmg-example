import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Image} from './Image';
import {fetchImage as getImage} from 'grid/modules/actions';
import ValueSelect from './select/ValueSelect';
import ModeSelect from './select/ModeSelect';

export class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      mode: null,
    }

    this.onModeChange = this.onModeChange.bind(this);
  }

  onModeChange(mode) {
    this.setState({mode: mode});
    console.log('mode changed', mode);
  }

  componentWillUpdate(nextProps) {
    let {dispatch, fetchImage} = nextProps;

    if (fetchImage.uri === this.props.fetchImage.uri) {
      return;
    }

    dispatch(getImage(fetchImage.uri()));
  }

  componentWillMount() {
    this.setState({mode: this.props.mode || 0});
  }

  render() {
    let {mode} = this.state;
    let {className} = this.props;
    let preview = null;

    if (this.props.image !== null) {
      let {uri, ...props} = this.props.image;
      preview = (<Image src={uri} {...props}/>)
    } else {
      className = (className +  ' empty').trim();
    }

    return (
      <div className={className}>
        <div className='settings'>
          <section className='mode-select'>
            <ModeSelect onChange={this.onModeChange} mode={mode}/>
          </section>
          <section className='value-select'>
            <ValueSelect
              mode={this.state.mode || 0} maxW={1400} maxH={1400}
              minW={100} minH={100}
              minPx={1000} maxPx={1000000}
            />
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
