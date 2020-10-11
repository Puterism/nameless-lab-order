import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Grid, Paper } from '@material-ui/core';
import Chart from './Chart';
import RecentOrders from './RecentOrders';
import useStyles from './Dashboard.css';

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [data] = useState({
    recentOrders: [],
  });

  // const getProfile = React.useCallback(async () => {
  //   const user = await fetchProfile();

  //   const { displayName, email, photoURL, emailVerified, uid } = user;
  //   console.log(displayName, email, photoURL, emailVerified, uid, user);
  //   return user;
  // }, []);

  // React.useEffect(() => {
  //   getProfile();
  // });

  // const getRecentOrders = useCallback(async () => {
  //   const fetchedData = await fetchOrders(5);
  //   setData((prevState) => {
  //     return {
  //       ...prevState,
  //       recentOrders: fetchedData,
  //     };
  //   });
  // }, []);

  // useEffect(() => {
  //   getRecentOrders();
  // }, [getRecentOrders]);

  useEffect(() => {}, []);

  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12}>
        <Paper className={fixedHeightPaper}>
          <Chart />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      {/* <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>

        </Paper>
      </Grid> */}
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <RecentOrders data={data.recentOrders} />
        </Paper>
      </Grid>
    </Grid>
  );
}
