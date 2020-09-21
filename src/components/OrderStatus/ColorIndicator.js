import React from 'react';
import useStyles from './ColorIndicator.css';

export default function ColorIndicator(props) {
  const classes = useStyles(props);
  return <div className={classes.dot} color={props.color}></div>;
}
