import React, { useState, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import useStyles from './Setting.css';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Setting() {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState({
    editProfile: false,
    changePassword: false,
  });

  const [alert, setAlert] = useState({
    open: false,
    severity: 'info',
    message: '',
  });

  // eslint-disable-next-line
  const openAlert = useCallback((message, severity) => {
    setAlert((prevState) => {
      let newAlert = { ...prevState };
      newAlert.open = true;
      newAlert.message = message;
      newAlert.severity = severity;
      return newAlert;
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlert((prevState) => {
      let newAlert = { ...prevState };
      newAlert.open = false;
      return newAlert;
    });
  }, []);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      closeAlert();
    },
    [closeAlert],
  );

  const handleClickOpenDialog = useCallback((dialog) => {
    setDialogOpen((prevState) => ({
      ...prevState,
      [dialog]: true,
    }));
  }, []);

  const handleCloseDialog = useCallback((dialog) => {
    setDialogOpen((prevState) => ({
      ...prevState,
      [dialog]: false,
    }));
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography varient="h5" component="h2" className={classes.header}>
          설정
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              계정 정보 수정
            </Typography>
            <Typography component="p" gutterBottom>
              발주처명을 비롯한 계정의 정보를 수정합니다.
            </Typography>
          </CardContent>
          <CardContent>
            <Button variant="contained" size="large" color="primary" onClick={() => handleClickOpenDialog('editProfile')}>
              정보 수정
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              비밀번호 변경
            </Typography>
            <Typography component="p" gutterBottom>
              계정의 비밀번호를 변경합니다.
            </Typography>
          </CardContent>
          <CardContent>
            <Button variant="contained" size="large" color="primary" onClick={() => handleClickOpenDialog('changePassword')}>
              비밀번호 변경
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Dialog open={dialogOpen.editProfile} onClose={() => handleCloseDialog('editProfile')} aria-labelledby="create-account-edit-profile">
        <DialogTitle id="create-account-edit-profile">계정 정보 수정</DialogTitle>
        <DialogContent>
          <DialogContentText>발주처명과 로그인에 사용될 이메일 주소를 입력해주세요. 기본 비밀번호는 nameless 입니다.</DialogContentText>
          <TextField type="text" fullWidth margin="dense" name="name" id="name" label="발주처명" autoFocus />
          <TextField type="email" fullWidth margin="dense" name="email" id="email" label="이메일" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog('editProfile')} color="primary">
            닫기
          </Button>
          <Button onClick={() => handleCloseDialog('editProfile')} color="primary">
            계정 생성
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={dialogOpen.changePassword}
        onClose={() => handleCloseDialog('changePassword')}
        aria-labelledby="change-password-dialog-title"
      >
        <DialogTitle id="change-password-dialog-title">비밀번호 변경</DialogTitle>
        <DialogContent>
          <DialogContentText>비밀번호를 변경하기 위해 이전 비밀번호를 입력해주세요</DialogContentText>
          <TextField type="email" fullWidth margin="dense" name="email" id="email" label="이메일" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog('changePassword')} color="primary">
            닫기
          </Button>
          <Button onClick={() => handleCloseDialog('changePassword')} color="primary">
            비밀번호 변경
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
