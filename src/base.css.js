import React from 'react';
import clsx from 'clsx';
import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { red, green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    // width: '100%',
  },
  red: {
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[900],
    },
  },
  green: {
    color: theme.palette.getContrastText(green[700]),
    backgroundColor: green[700],
    '&:hover': {
      backgroundColor: green[900],
    },
  },
}));

export const LoadingButton = ({ loading, children, customColor, ...rest }) => {
  const classes = useStyles();

  const buttonClassName = clsx([classes.buttonWrapper, customColor === 'red' && classes.red, customColor === 'green' && classes.green]);

  return (
    <Button className={buttonClassName} {...rest} disabled={loading}>
      {loading ? <CircularProgress color="inherit" size="1.7em" /> : children}
    </Button>
  );
};
