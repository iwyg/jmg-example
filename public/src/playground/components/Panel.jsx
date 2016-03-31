import ReactDOM from 'react-dom';
import React, {PropTypes} from 'react';
import {className, callIfFunc} from 'lib/react-helper';
import {Button, IconButton} from 'react-toolbox';
import Tooltip from 'react-toolbox/lib/tooltip';
import {isFunc, isObject} from 'lib/assert';
import {
  IconSettings, IconCheck, IconAdd, IconJmg, Icon,
  IconAddCirc, IconRemoveCirc,
  TooltipIcon
} from './Icons';
import {Settings} from './Settings';
import {ButtonAdd} from './Buttons';
import Overflow from './Overflow';
import {connect} from 'react-redux';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import ReactIScroll from 'react-iscroll';
import iScroll from 'iscroll/build/iscroll-probe';

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

  static propTypes = {
    options: PropTypes.object,
    style: PropTypes.object,
    onChange: PropTypes.func
  }

  static defaultProps = {
    style: {},
    options: {
      eventPassthrough: 'horizontal',
      preventDefault: true,
      bounce: true,
      scrollbars: true,
      fadeScrollbars: false,
      mouseWheel: true,
      freeScroll: false,
      invertWheelDirection: false,
      momentum: false
    }
  }

  onChange() {
		if (!isFunc(this.props.onChange)) {
      return;
    }

    let promise = new Promise((resolve, reject) => {
      this.props.onChange(ReactDOM.findDOMNode(this.refs.content), resolve, reject);
    });

    promise.then(() => {
      this.refs.container.getIScroll().refresh();
    }).catch((err) => {
    });
  }

  onScrollRefresh = (scroller) => {
    this.onChange();
  }

  componentDidUpdate(prevProps) {
    this.onChange();
  }

  render() {
    let {children, options, ...props} = this.props;

    return (
      <ReactIScroll className={className('panel-content', props)} ref='container' iScroll={iScroll}
        onScroll={this.onScroll}
        onRefresh={this.onScrollRefresh} options={options}
        {...props}
      >
        <div ref='content'>{children}</div>
      </ReactIScroll>
    );
  }
};

/**
 * class Panel
 */
export class Panel extends React.Component {

  static propTypes = {
    onSelectImage: PropTypes.func,
    onDeselectImage: PropTypes.func,
    onApply: PropTypes.func.isRequired,
    selecting: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    showProgress: PropTypes.bool
  }

  static defaultProps = {
    onSelectImage: null,
    selecting: false,
    disabled: false,
    showProgress: false
  }

  state = {
    selecting: false,
    selected: false,
    height: null
  }

  hasImage() {
    return isObject(this.props.image) && 0 < Object.keys(this.props.image).length;
  }

  handleContentChange = (content, resolve, reject) => {
    let {height} = this.refs.container.getBoundingClientRect();
    let styleHeight = content.getBoundingClientRect().height > height ? '100%' : null;

    if (styleHeight === this.state.height) {
      reject();
      return;
    }

    console.log('set state', this.setState({height: styleHeight}, (...args) => {
      console.log(args);
    }));

    setTimeout(() => {
      resolve();
    }, 100);
  }

  addSettings = () => {
    let {dispatch} = this.props;
    dispatch(addSettings());
  }

  removeSettings = (index) => {
    let {dispatch} = this.props;
    dispatch(removeSettings(index));
  }

  toggleSettings = (index, visible) => {
    let {dispatch} = this.props;
    dispatch(toggleSettingVisible(index, visible));
  }

  onParamsUpdate = (index, mode, params) => {
    let {dispatch} = this.props;

    dispatch(updateParams(mode, params, index));
  }

  selectImage = () => {
    let {onSelectImage} = this.props;
    isFunc(onSelectImage) && onSelectImage();
  }

  deselectImage = () => {
    if (this.props.image === null) {
      return;
    }
    let {onDeselectImage} = this.props;
    isFunc(onDeselectImage) && onDeselectImage();
  }

  onSettingSupdate = (i, index, params, filters = []) => {
    let {dispatch} = this.props;
    dispatch(updateSettings({index, params, filters}, i));
  }

  settingChangedMode = (index, mode) => {
    let {dispatch} = this.props;
    dispatch(changeSettingsMode(index, mode));
  }

  onApply = () => {
    let {onApply, settings} = this.props;
    onApply(settings);
  }

  componentDidUpdate(prevProps) {
    let {image} = prevProps;
    let {settings} = this.props;

    if (image !== this.props.image) {
      this.setState({selected: this.hasImage()});
      if (this.hasImage() && settings.length === 0) {
        this.addSettings();
      } else if (this.props.image === null) {
        this.removeSettings(-1);
      }
    }

  }

  trashAll = () => {
    this.deselectImage();
  }

  renderButtons() {
    let className = this.props.selecting ? 'select-image selecting' : 'select-image';
    let selectImage = (
      <TooltipIcon className={className} tooltip='Select image' button={true} onClick={this.selectImage}>
        <Icon><IconAddCirc></IconAddCirc></Icon>
      </TooltipIcon>
    );

    let trash = this.state.selected ? (
      <TooltipIcon className='cancel-all' tooltip='Cancel all' button={true} onClick={this.trashAll}>
        <Icon><IconRemoveCirc></IconRemoveCirc></Icon>
      </TooltipIcon>
    ) : null;

    //<IconSettings/><IconAdd/>
    //disabled={!this.state.selected}
    return (
      <div className='buttons'>
        <Icon className='icon-logo'>
          <IconJmg></IconJmg>
        </Icon>
        <div className='ctrls'>
          {trash}
          {selectImage}
        </div>
      </div>
    );
  }

  renderSettings() {
    let {settings, ...props} = this.props;
    let addSettings = (<ToolTipBtn tooltip='Add Parameters' onClick={this.addSettings}
        className='add-setting' key='addSetting'
        disabled={!this.state.selected}
      >
       <IconSettings/>
       <IconAdd/>
      </ToolTipBtn>);
    if (!settings.length) {
      return this.state.selected ? addSettings : null;
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
      }).concat([addSettings]);
  }

  renderFooter() {
    if (!this.props.settings.length) {
      return null;
    }

    return [this.props.showProgress ? (<ProgressBar key='progress' className='progress-apply ' type='linear' mode='indeterminate'/>) : null, (
      <Button onClick={this.onApply} disabled={this.props.disabled} flat={true} className='apply-settings' key='btn-apply'>
        <IconCheck></IconCheck>
        Apply
      </Button>
    )];
  }

  render() {

    let postfix = this.props.settings.length ? ' loaded' : '';
    let style = {height: this.state.height};

    return (
      <div style={style} className={className('panel', this.props) + postfix} ref='container'>
        <PanelHeader>
          {this.renderButtons()}
        </PanelHeader>
        <PanelContent ref='content' onChange={this.handleContentChange}>
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

const mapStateToProps = (state) => {
  return {settings: state.settings};
};

export default connect(mapStateToProps)(Panel);
