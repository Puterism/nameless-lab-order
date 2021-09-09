import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import { Header, SidebarMenu } from 'components';
import useStyles from './Main.css';

export default function Main({ admin, children }) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Header open={open} onDrawerOpen={handleDrawerOpen} />
      <SidebarMenu open={open} onDrawerClose={handleDrawerClose} admin={admin} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>
      </main>
    </div>
  );
}

Main.defaultProps = {
  children: null,
};
