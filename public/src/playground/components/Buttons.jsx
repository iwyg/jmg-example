import React, {PropTypes} from 'react';
import {Button, IconButton} from 'react-toolbox';
import {IconAdd} from './Icons';
import {className as cn} from 'lib/react-helper';

export const ButtonAdd = ({...props}) => {

  let {className, ...rest} = props;
  let buttonClass = cn('icon-button', props);

  return (
    <Button accent={false} floating={true} className={buttonClass} {...rest}>
      <IconAdd></IconAdd>
    </Button>
  )
};
