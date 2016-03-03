import React, {PropTypes} from 'react';

const SelectGroup = ({children, label}) => {
  let lbl = label ? (<label>{label}</label>) : null;
  return (<div className="select-group">{lbl}{children}</div>);
}

SelectGroup.propTypes = {
  label: PropTypes.string
};

export default SelectGroup;
