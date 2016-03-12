import React, {PropTypes} from 'react';
import {Button, IconButton} from 'react-toolbox';
import {IconAdd} from './Icons';

export const ButtonAdd = ({...props}) => {
  return (
    <Button accent={true} floating={true} {...props}>
      <IconAdd></IconAdd>
    </Button>
  )
};
