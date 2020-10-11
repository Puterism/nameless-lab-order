import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import useStyles from './SidebarMenu.css';
import { auth } from 'configs/firebase';

export default function SidebarMenu({ open, onDrawerClose }) {
  const classes = useStyles();
  const { pathname } = useLocation();

  const handleLogout = () => {
    auth.signOut().catch((error) => {
      console.error(error);
    });
  };

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={onDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          selected={pathname === '/admin'}
          component={Link}
          to="/admin"
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="대시보드" />
        </ListItem>
        <ListItem
          button
          selected={pathname === '/admin/order-status'}
          component={Link}
          to="/admin/order-status"
        >
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="발주 현황" />
        </ListItem>
        <ListItem
          button
          selected={pathname === '/admin/item'}
          component={Link}
          to="/admin/item"
        >
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="품목 관리" />
        </ListItem>
        <ListItem
          button
          selected={pathname === '/admin/account'}
          component={Link}
          to="/admin/account"
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="계정 관리" />
        </ListItem>
        <ListItem
          button
          selected={pathname === '/admin/notice'}
          component={Link}
          to="/admin/notice"
        >
          <ListItemIcon>
            <AnnouncementIcon />
          </ListItemIcon>
          <ListItemText primary="공지사항" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListSubheader inset>계정</ListSubheader>
        <ListItem
          button
          selected={pathname === '/admin/setting'}
          component={Link}
          to="/admin/setting"
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="설정" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="로그아웃" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListSubheader inset>업체</ListSubheader>
        <ListItem button selected={pathname === '/'} component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="대시보드" />
        </ListItem>
        <ListItem
          button
          selected={pathname === '/order'}
          component={Link}
          to="/order"
        >
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="발주하기" />
        </ListItem>
        <ListItem
          button
          selected={pathname === '/order-status'}
          component={Link}
          to="/order-status"
        >
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="발주 현황" />
        </ListItem>
        <ListItem
          button
          selected={pathname === '/notice'}
          component={Link}
          to="/notice"
        >
          <ListItemIcon>
            <AnnouncementIcon />
          </ListItemIcon>
          <ListItemText primary="공지사항" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListSubheader inset>계정</ListSubheader>
        <ListItem
          button
          selected={pathname === '/setting'}
          component={Link}
          to="/setting"
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="설정" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="로그아웃" />
        </ListItem>
      </List>
    </Drawer>
  );
}

SidebarMenu.defaultProps = {
  open: true,
  onDrawerOpen: () => null,
};
