import React, {PropTypes} from 'react';
import {className} from 'lib/react-helper';
import {Image} from './Image';
import ProgressBar from 'react-toolbox/lib/progress_bar';

/**
 * default class Preview
 */
export default class Preview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.imageDidLoad = this.imageDidLoad.bind(this);
    this.imageWillLoad = this.imageWillLoad.bind(this);
  }

  imageWillLoad(img) {
    this.setState({loading: true});
  }

  imageDidLoad(loaded) {
    setTimeout(() => {
      this.setState({loading: false});
    }, 50);
  }

  render() {
    let {image} = this.props;
    let defaultClass = 'preview-image';

    if (image === null) {
      return (
        <div className={defaultClass}>
          <label>no image selected</label>
        </div>
      );
    }

    let {uri, ...props} = image;
    let icl = image.width > image.height ? 'landscape' : 'portrait';
    let spinner = this.state.loading ?
      (<ProgressBar className='loading' type='circular' mode='indeterminate' />) : null;

    return (
      <div className={className('preview-container', this.props)}>
        <InfoBar info={image} keys={['width', 'height', 'type', 'color', 'uri']}></InfoBar>
        <figure className={defaultClass}>
          {spinner}
          <Image className={icl} src={uri} {...props} onLoad={this.imageWillLoad} onLoaded={this.imageDidLoad} >
          </Image>
        </figure>
      </div>
    );
  }
}

Preview.propTypes = {
  image: PropTypes.object
};

Preview.defaultProps = {
  image: null
};

/**
 * class InfoBar
 */
export class InfoBar extends React.Component {
  renderItem(name, index) {
    let {info} = this.props;
    return (
      <div className={'item ' + name} key={index}>
        <label>{name}</label><p>{info[name]}</p>
      </div>
    );
  }

  render() {
    let {info, keys} = this.props;

    let renderKeys = keys.filter((k) => {
      return info[k] !== undefined;
    });

    return (
      <div className={this.props.className}>
        {renderKeys.map(this.renderItem.bind(this))}
      </div>
    );
  }
}

InfoBar.propTypes = {
  info: PropTypes.object.isRequired,
  keys: PropTypes.array
};

InfoBar.defaultProps = {
  info: {},
  keys: ['width', 'height'],
  className: 'info-bar'
};
