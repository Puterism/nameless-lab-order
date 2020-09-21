import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { CssBaseline, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Loading, Main, SignIn, Dashboard, OrderStatus, Item, Account, Order, Setting } from './components';
import UserContext from 'contexts/UserContext';
import useAuth from 'hooks/useAuth';

const PrivateRoute = ({ children, path, ...rest }) => {
  const { pending, user, isAdmin } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        console.log('PrivateRoute', pending, user, isAdmin);
        return pending ? (
          <Loading />
        ) : !pending && !user ? (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        ) : isAdmin ? ( // for production -> isAdmin
          <Redirect
            to={{
              pathname: '/admin',
              state: { from: props.location },
            }}
          />
        ) : (
          children
        );
      }}
    />
  );
};

const AdminRoute = ({ children, path, ...rest }) => {
  const { pending, user, isAdmin } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        console.log('AdminRoute', !pending && !user && !isAdmin);
        return pending ? (
          <Loading />
        ) : !pending && !user ? (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        ) : !isAdmin ? (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
        ) : (
          children
        );
      }}
    />
  );
};

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Noto Sans KR"',
      'Roboto',
      '"Helvetica Neue"',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      light: '#5b5b5b',
      main: '#333333',
      dark: '#232323',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffffff',
      main: '#fafafa',
      dark: '#c7c7c7',
      contrastText: '#000000',
    },
    // error: {
    //   light: '#e57373',
    //   main: '#f44336',
    //   dark: '#d32f2f',
    // },
    // warning: {
    //   light: '#ffb74d',
    //   main: '#ff9800',
    //   dark: '#f57c00',
    // },
    // info: {
    //   light: '#64b5f6',
    //   main: '#2196f3',
    //   dark: '#1976d2',
    // },
    // success: {
    //   light: '#81c784',
    //   main: '#4caf50',
    //   dark: '#388e3c',
    // },
  },
});

function App() {
  const { pending, user, isAdmin } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContext.Provider value={{ pending, user, isAdmin }}>
        <Router>
          <Switch>
            <Route exact path="/login">
              <SignIn />
            </Route>
            <Main>
              <Switch>
                <AdminRoute exact path="/admin">
                  <Dashboard admin />
                </AdminRoute>
                <AdminRoute exact path="/admin/order-status">
                  <OrderStatus admin />
                </AdminRoute>
                <AdminRoute exact path="/admin/item">
                  <Item />
                </AdminRoute>
                <AdminRoute exact path="/admin/account">
                  <Account />
                </AdminRoute>
                <AdminRoute exact path="/admin/setting">
                  <Setting admin />
                </AdminRoute>

                <PrivateRoute exact path="/">
                  <Dashboard />
                </PrivateRoute>
                <PrivateRoute exact path="/order">
                  <Order />
                </PrivateRoute>
                <PrivateRoute exact path="/order-status">
                  <OrderStatus />
                </PrivateRoute>
                <PrivateRoute exact path="/setting">
                  <Setting />
                </PrivateRoute>
              </Switch>
            </Main>
          </Switch>
        </Router>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
