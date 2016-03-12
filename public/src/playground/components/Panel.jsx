import React, {PropTypes} from 'react';
import {className} from 'lib/react-helper';
import {Button, IconButton} from 'react-toolbox';
import {isFunc, isObject} from 'lib/assert';
import {IconSettings} from './Icons';
import {Pane} from './Settings';
import {ButtonAdd} from './Buttons';

/**
 * class PanelHeader
 */
class PanelHeader extends React.Component {
  render() {
    return (
      <header className={className('panel-header', this.props)}>
        {this.props.children}
      </header>
    );
  }
}

class PanelFooter extends React.Component {
  render() {
    return (
      <Footer className={className('panel-footer', this.props)}>
        {this.props.children}
      </Footer>
    );
  }
}

/**
 * class Panel
 */
export default class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selecting: false,
      selected: false,
      settings: []
    };

    this.selectImage = this.selectImage.bind(this);
    this.addSettings = this.addSettings.bind(this);
  }

  addSettings() {
    alert('add settings you shmock');
  }

  selectImage() {
    let {onSelectImage} = this.props;
    isFunc(onSelectImage) && onSelectImage();
  }

  hasImage() {
    return isObject(this.props.image) && 0 < Object.keys(this.props.image).length;
  }

  componentDidUpdate(prevProps) {
    let {image} = prevProps;

    if (image !== this.props.image) {
      this.setState({selected: this.hasImage()});
    }
  }

  renderButtons() {
    let className = this.props.selecting ? 'select-image selecting' : 'select-image';
    let selectImage = (
      <ButtonAdd className={className} onClick={this.selectImage} />
    );
    let addSettings = this.state.selected ?
      (
        <IconButton primary onClick={this.addSettings}>
          <IconSettings/>
        </IconButton>
      ) : null;
    return (
      <div className='buttons'>
        {addSettings}
        {selectImage}
      </div>
    );
  }

  render() {
    return (
      <div className={className('panel', this.props)}>
        <PanelHeader>
          {this.renderButtons()}
        </PanelHeader>
        <Pane/>
        {this.props.children}

        <PanelHeader>
        </PanelHeader>
      </div>
    );
  }
}

Panel.propTypes = {
  onSelectImage: PropTypes.func,
  selecting: PropTypes.bool.isRequired
};

Panel.defaultProps = {
  onSelectImage: null,
  selecting: false
};

