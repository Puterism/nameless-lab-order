import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import useStyles from './Notice.css';

export default function Notice() {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography varient="h5" component="h2" className={classes.header}>
          공지사항
        </Typography>
      </Grid>
    </Grid>
  );
}
