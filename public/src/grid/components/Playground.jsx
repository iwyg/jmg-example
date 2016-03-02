import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Image} from './Image';
import {selectImage, fetchImage as getImage} from 'grid/modules/actions';
import ValueSelect from './select/ValueSelect';
import ModeSelect from './select/ModeSelect';
import {Button} from 'react-toolbox/lib/button';

export class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: false,
      image: null,
      mode: null,
      values: {}
    }

    this.onModeChange = this.onModeChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.onApply = this.onApply.bind(this);
    this.selectImage = this.selectImage.bind(this);
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

  selectImage() {
    this.setState({select: !this.state.select});
  }

  onModeChange(mode) {
    this.setState({mode: mode});
  }

  onValueChange(values) {
    this.setState({values: values});
  }

  componentWillUpdate(nextProps) {
    let {dispatch, fetchImage} = nextProps;

    if (this.props.image !== nextProps.image) {
      this.setState({select: false});
    }

    if (fetchImage.uri === this.props.fetchImage.uri) {
      return;
    }


    dispatch(getImage(fetchImage.uri()));
  }

  componentWillMount() {
    this.setState({mode: this.props.mode || 0});
  }

  renderSettings(mode, image)
  {
    return (
      <div className="panel">
        <section className='mode-select'>
          <label>Mode</label>
          <ModeSelect onChange={this.onModeChange} mode={mode}/>
        </section>
        <section className='value-select'>
          <label>Settings</label>
          <ValueSelect
            mode={mode || 0} maxW={1400} maxH={1400}
            color={image.color}
            minW={100} minH={100}
            minPx={1000} maxPx={1000000}
            minScale={10} maxScale={200}
            onChange={this.onValueChange}
          />
        </section>
        <section className='value-apply'>
          <Button onClick={this.onApply}>Apply</Button>
        </section>
      </div>
    );
  }

  renderPreview(image) {
    let className = 'preview-image';
    if (image === null) {
      return (
        <div className={className}>
          <label>no image selected</label>
        </div>
      );
    }

    let {uri, ...props} = image;
    let icl = image.width > image.height ? 'landscape' : 'portrait';

    return (
      <div className={className}>
        <Image className={icl} src={uri} {...props}/>
      </div>
    );
  }

  render() {
    let {mode} = this.state;
    let {className, image} = this.props;

    if (image === null) {
      className = (className +  ' empty').trim();
    }

    let previewClass = this.state.select ? 'preview select' : 'preview';
    let buttonClass = this.state.select ? 'abort select' : 'select';

    return (
      <div className={className}>
        <div className='settings'>
          { image !== null ? this.renderSettings(mode, image) : null}
          <section><label>select image</label>
            <Button icon='+' className={buttonClass} floating={true} accent={true} onClick={this.selectImage}></Button>
          </section>
        </div>
        <div className={previewClass}>
          {this.renderPreview(image)}
          {this.props.children}
        </div>
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
