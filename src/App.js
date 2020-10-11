import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { CssBaseline, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Loading, Main } from './components';
import { SignIn, Dashboard, OrderStatus, Item, Account, Order, Setting, Notice } from 'containers';
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
        ) : !isAdmin ? ( // for production -> isAdmin
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
                <AdminRoute exact path="/admin/notice">
                  <Notice admin />
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
                <PrivateRoute exact path="/notice">
                  <Notice />
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
