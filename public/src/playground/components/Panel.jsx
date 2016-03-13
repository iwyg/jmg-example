import React, {PropTypes} from 'react';
import {className} from 'lib/react-helper';
import {Button, IconButton} from 'react-toolbox';
import {isFunc, isObject} from 'lib/assert';
import {IconSettings} from './Icons';
import {Settings} from './Settings';
import {ButtonAdd} from './Buttons';
import {connect} from 'react-redux';
import {
  addSettings, updateSettings,
  removeSettings, changeSettingsMode
} from 'playground/modules/actions';

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
export class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selecting: false,
      selected: false
    };

    this.selectImage = this.selectImage.bind(this);
    this.addSettings = this.addSettings.bind(this);
    this.onSettingSupdate = this.onSettingSupdate.bind(this);
    this.settingChangedMode = this.settingChangedMode.bind(this);
  }

  addSettings() {
    let {dispatch} = this.props;
    dispatch(addSettings());
  }

  removeSettings(index) {
    let {dispatch} = this.props;
    dispatch(removeSettings(index));
  }

  updateSettings() {
    alert('add settings you shmock');
  }

  selectImage() {
    let {onSelectImage} = this.props;
    isFunc(onSelectImage) && onSelectImage();
  }

  hasImage() {
    return isObject(this.props.image) && 0 < Object.keys(this.props.image).length;
  }

  onSettingSupdate(i, index, params, filters = []) {
    console.log(i, index, params, filters);

    let {dispatch} = this.props;
    dispatch(updateSettings({index, params, filters}, i));
  }

  settingChangedMode(index, mode) {
    let {dispatch} = this.props;
    dispatch(changeSettingsMode(index, mode));
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

  renderSettings() {
    let {settings} = this.props;
    if (!settings.length || !this.state.selected) {
      return null;
    }
    return (<div>{settings.map((setting, i) => {
        let {mode, params, filters, ...rest} = setting;
        console.log(params, setting);
        return (<Settings onUpdate={function () {}} onModeChange={this.settingChangedMode}
          index={i}
          key={i}
          mode={mode}
          params={params}
          filters={filters}
          {...rest}>
        </Settings>);
      })}</div>);
  }

  render() {
    return (
      <div className={className('panel', this.props)}>
        <PanelHeader>
          {this.renderButtons()}
        </PanelHeader>
        {this.renderSettings()}
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


const mapStateToProps = (state) => {
  return {settings: state.settings};
};

export default connect(mapStateToProps)(Panel);
