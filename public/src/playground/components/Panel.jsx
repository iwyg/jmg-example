import React, {PropTypes} from 'react';
import {className} from 'lib/react-helper';
import {Button, IconButton} from 'react-toolbox';
import Tooltip from 'react-toolbox/lib/tooltip';
import {isFunc, isObject} from 'lib/assert';
import {IconSettings, IconCheck, IconAdd, Icon} from './Icons';
import {Settings} from './Settings';
import {ButtonAdd} from './Buttons';
import {connect} from 'react-redux';

import {
  addSettings, updateSettings,
  updateParams,
  removeSettings, changeSettingsMode,
  toggleSettingVisible
} from 'playground/modules/actions';

const AbstractBtn = ({...props}) => {
  return (
    <Button {...props}></Button>
  );
};

const ToolTipBtn = Tooltip(AbstractBtn);

/**
 * func PanelHeader
 */
const PanelHeader = ({children, ...props}) => {
  return (
    <header className={className('panel-header', props)}>
      {children}
    </header>
  );
};

/**
 * func PanelFooter
 */
const PanelFooter = ({children, ...props}) => {
  return (
    <footer className={className('panel-footer', props)}>
      {children}
    </footer>
  );
};

/**
 * func PanelFooter
 */
class PanelContent extends React.Component {
  render() {
    let {...props, children} = this.props;
    return (
      <div className={className('panel-content', props)} {...props}>
        {children}
      </div>
    );
  }
};

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

    this.selectImage        = this.selectImage.bind(this);
    this.addSettings        = this.addSettings.bind(this);
    this.removeSettings     = this.removeSettings.bind(this);
    this.onSettingSupdate   = this.onSettingSupdate.bind(this);
    this.onParamsUpdate     = this.onParamsUpdate.bind(this);
    this.settingChangedMode = this.settingChangedMode.bind(this);
    this.toggleSettings     = this.toggleSettings.bind(this);
    this.onApply            = this.onApply.bind(this);
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

  toggleSettings(index, visible) {
    let {dispatch} = this.props;
    dispatch(toggleSettingVisible(index, visible));
  }

  onParamsUpdate(index, mode, params) {
    let {dispatch} = this.props;

    dispatch(updateParams(mode, params, index));
  }

  selectImage() {
    let {onSelectImage} = this.props;
    isFunc(onSelectImage) && onSelectImage();
  }

  hasImage() {
    return isObject(this.props.image) && 0 < Object.keys(this.props.image).length;
  }

  onSettingSupdate(i, index, params, filters = []) {
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

  onApply() {
    let {onApply, settings} = this.props;
    onApply(settings);
  }

  renderButtons() {
    let className = this.props.selecting ? 'select-image selecting' : 'select-image';
    let selectImage = (
      <ButtonAdd className={className} onClick={this.selectImage} />
    );

    //<IconSettings/><IconAdd/>
    //disabled={!this.state.selected}
    let addSettings = (<ToolTipBtn
        tooltip='Add Parameters'
        onClick={this.addSettings}
        className='add-setting'
        disabled={!this.state.selected}
      >
       <IconSettings/><IconAdd/>
      </ToolTipBtn>);
    return (
      <div className='buttons'>
        {addSettings}
        {selectImage}
      </div>
    );
  }

  renderSettings() {
    let {settings, ...props} = this.props;
    if (!settings.length || !this.state.selected) {
      return null;
    }
    return settings.map((setting, i) => {
        let {mode, params, filters, ...rest} = setting;
        return (<Settings onUpdate={this.onParamsUpdate} onModeChange={this.settingChangedMode}
          onRemove={this.removeSettings}
          onToggle={this.toggleSettings}
          index={i}
          key={i}
          mode={mode}
          params={params}
          filters={filters}
          {...props}
          className={null}
          {...rest}>
        </Settings>);
      });
  }

  renderFooter() {
    if (!this.props.settings.length) {
      return null;
    }
    return (
      <Button onClick={this.onApply} disabled={this.props.disabled} flat={true} accent={false}>
        <IconCheck></IconCheck>
        Apply
      </Button>
    );
  }

  render() {
    return (
      <div className={className('panel', this.props)}>
        <PanelHeader>
          {this.renderButtons()}
        </PanelHeader>
        <PanelContent ref='content'>
          {this.renderSettings()}
          {this.props.children}
        </PanelContent>
        <PanelFooter>
        {this.renderFooter()}
        </PanelFooter>
      </div>
    );
  }
}

Panel.propTypes = {
  onSelectImage: PropTypes.func,
  onApply: PropTypes.func.isRequired,
  selecting: PropTypes.bool.isRequired,
  disabled: PropTypes.bool
};

Panel.defaultProps = {
  onSelectImage: null,
  selecting: false,
  disabled: false
};


const mapStateToProps = (state) => {
  return {settings: state.settings};
};

export default connect(mapStateToProps)(Panel);
