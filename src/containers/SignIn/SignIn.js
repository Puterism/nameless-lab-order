import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import { TextField, Link, Grid, Container, Typography, Box } from '@material-ui/core';
import UserContext from 'contexts/UserContext';
import { auth } from 'configs/firebase';
import { LoadingButton } from 'components';
import useStyles from './SignIn.css';

export default function SignIn() {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();

  const [error, setError] = useState({
    code: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const { code, message } = error;

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  const handleLogin = (data) => {
    setLoading(true);

    const { email, password } = data;

    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      const { code, message } = error;
      setLoading(false);
      setError({
        ...error,
        code: code,
        message: message,
      });
    });
  };

  const { user } = useContext(UserContext);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <img src="/images/nameless_logo_full_black.png" alt="nameless coffee lab" className={classes.logo} />
        <Typography component="h1" variant="h5">
          네임리스 발주 시스템
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(handleLogin)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="이메일 주소"
            name="email"
            inputRef={register({
              required: true,
            })}
            autoComplete="email"
            autoFocus
            error={code === 'auth/user-not-found'}
            helperText={code === 'auth/user-not-found' && '이메일을 다시 확인해주세요'}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            inputRef={register({
              required: true,
            })}
            autoComplete="current-password"
            error={code === 'auth/wrong-password'}
            helperText={code === 'auth/wrong-password' && '비밀번호를 다시 확인해주세요'}
          />
          <LoadingButton type="submit" fullWidth variant="contained" color="primary" className={classes.submit} loading={loading}>
            로그인
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                비밀번호를 잊으셨나요?
              </Link>
            </Grid>
          </Grid>
          <Box component="p" className={classes.errorMessage}>
            {message}
          </Box>
        </form>
      </div>
    </Container>
  );
}
