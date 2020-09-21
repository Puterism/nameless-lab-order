import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  buttonWrapper: {
    width: '100%',
    height: '3em',
  },
}));

export const LoadingButton = ({ loading, children, ...rest }) => {
  const classes = useStyles();

  return (
    <Button className={classes.buttonWrapper} {...rest}>
      {loading ? <CircularProgress color="inherit" size="1.7em" /> : children}
    </Button>
  );
};
