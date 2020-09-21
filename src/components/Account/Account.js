import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import useStyles from './Account.css';
import { createAccount, grantAdmin, releaseAdmin, disableAccount, enableAccount } from 'api';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Account() {
  const classes = useStyles();
  const { register, control, handleSubmit } = useForm();

  const [dialogOpen, setDialogOpen] = useState({
    createAccount: false,
    grantAdmin: false,
    disableAccount: false,
  });

  const [alert, setAlert] = useState({
    open: false,
    severity: 'info',
    message: '',
  });

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

  const handleSubmitCreateAccount = useCallback(
    async (data) => {
      const { name, email } = data;
      const password = 'nameless';
      try {
        if (!!name && !!email) {
          await createAccount(name, email, password);
          handleCloseDialog('createAccount');
          openAlert(`${name} 계정이 생성되었습니다.`, 'success');
        } else {
          openAlert(`입력되지 않은 항목이 있습니다.`, 'error');
        }
      } catch (err) {
        openAlert(`에러 발생 : ${err}`, 'error');
      }
    },
    [handleCloseDialog, openAlert],
  );

  const handleSubmitGrantAdmin = useCallback(
    async (data) => {
      const { email, select } = data;
      try {
        if (!!email && select === 'assign') {
          await grantAdmin(email);
          handleCloseDialog('grantAdmin');
          openAlert(`${email} 계정이 관리자로 지정되었습니다.`, 'success');
        } else if (!!email && select === 'release') {
          await releaseAdmin(email);
          handleCloseDialog('grantAdmin');
          openAlert(`${email} 계정이 관리자 해제되었습니다.`, 'success');
        } else {
          openAlert(`이메일을 입력해주세요.`, 'error');
        }
      } catch (err) {
        openAlert(`에러 발생 : ${err}`, 'error');
      }
    },
    [handleCloseDialog, openAlert],
  );

  const handleSubmitDisableAccount = useCallback(
    async (data) => {
      const { email, select } = data;
      try {
        if (!!email && select === 'disable') {
          await disableAccount(email);
          handleCloseDialog('disableAccount');
          openAlert(`${email} 계정이 비활성화되었습니다.`, 'success');
        } else if (!!email && select === 'enable') {
          await enableAccount(email);
          handleCloseDialog('disableAccount');
          openAlert(`${email} 계정이 활성화되었습니다.`, 'success');
        } else {
          openAlert(`이메일을 입력해주세요.`, 'error');
        }
      } catch (err) {
        openAlert(`에러 발생 : ${err}`, 'error');
      }
    },
    [handleCloseDialog, openAlert],
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography varient="h5" component="h2" className={classes.header}>
          계정 관리
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              계정 생성
            </Typography>
            <Typography component="p" gutterBottom>
              발주처의 계정을 생성합니다.
            </Typography>
          </CardContent>
          <CardContent>
            <Button variant="contained" size="large" color="primary" onClick={() => handleClickOpenDialog('createAccount')}>
              계정 생성
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              관리자 지정/해제
            </Typography>
            <Typography component="p" gutterBottom>
              계정을 관리자로 지정하거나 해제합니다. 관리자 계정으로 로그인할 경우 관리자 화면으로 접속됩니다.
            </Typography>
          </CardContent>
          <CardContent>
            <Button variant="contained" size="large" color="primary" onClick={() => handleClickOpenDialog('grantAdmin')}>
              관리자 지정/해제
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              계정 활성화/비활성화
            </Typography>
            <Typography component="p" gutterBottom>
              로그인할 수 없도록 계정을 비활성화합니다. 비활성화된 계정을 다시 활성화할 수 있습니다.
            </Typography>
          </CardContent>
          <CardContent>
            <Button variant="contained" size="large" color="primary" onClick={() => handleClickOpenDialog('disableAccount')}>
              계정 활성화/비활성화
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={dialogOpen.createAccount}
        onClose={() => handleCloseDialog('createAccount')}
        aria-labelledby="create-account-dialog-title"
      >
        <form onSubmit={handleSubmit(handleSubmitCreateAccount)}>
          <DialogTitle id="create-account-dialog-title">계정 생성</DialogTitle>
          <DialogContent>
            <DialogContentText>발주처명과 로그인에 사용될 이메일 주소를 입력해주세요. 기본 비밀번호는 nameless 입니다.</DialogContentText>
            <TextField
              type="text"
              fullWidth
              margin="dense"
              name="name"
              id="name"
              label="발주처명"
              inputRef={register({ required: true })}
              autoFocus
            />
            <TextField
              type="email"
              fullWidth
              margin="dense"
              name="email"
              id="email"
              label="이메일"
              inputRef={register({ required: true })}
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => handleCloseDialog('createAccount')} color="primary">
              닫기
            </Button>
            <Button type="submit" color="primary">
              계정 생성
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={dialogOpen.grantAdmin} onClose={() => handleCloseDialog('grantAdmin')} aria-labelledby="grant-admin-dialog-title">
        <form onSubmit={handleSubmit(handleSubmitGrantAdmin)}>
          <DialogTitle id="grant-admin-dialog-title">관리자 지정/해제</DialogTitle>
          <DialogContent>
            <DialogContentText>관리자로 지정하거나 해제할 계정의 이메일을 입력해주세요</DialogContentText>
            <FormControl component="fieldset">
              <Controller
                as={RadioGroup}
                row
                aria-label="select=admin-assign-or-release"
                name="select"
                control={control}
                defaultValue="assign"
              >
                <FormControlLabel value="assign" control={<Radio color="primary" />} label="관리자 지정" />
                <FormControlLabel value="release" control={<Radio color="primary" />} label="관리자 해제" />
              </Controller>
            </FormControl>
            <TextField
              type="email"
              fullWidth
              autoFocus
              margin="dense"
              name="email"
              id="email"
              label="이메일"
              inputRef={register({ required: true })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCloseDialog('grantAdmin')} color="primary">
              닫기
            </Button>
            <Button type="submit" color="primary">
              적용
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={dialogOpen.disableAccount}
        onClose={() => handleCloseDialog('disableAccount')}
        aria-labelledby="disable-account-dialog-title"
      >
        <form onSubmit={handleSubmit(handleSubmitDisableAccount)}>
          <DialogTitle id="disable-account-dialog-title">계정 활성화/비활성화</DialogTitle>
          <DialogContent>
            <DialogContentText>
              비활성화 혹은 활성화할 계정의 이메일을 입력해주세요. 계정을 비활성화할 경우 활성화하기 전까지 더 이상 로그인할 수 없습니다.
            </DialogContentText>
            <FormControl component="fieldset">
              <Controller as={RadioGroup} row aria-label="select-enable-or-disable" name="select" control={control} defaultValue="disable">
                <FormControlLabel value="disable" control={<Radio color="primary" />} label="비활성화" />
                <FormControlLabel value="enable" control={<Radio color="primary" />} label="활성화" />
              </Controller>
            </FormControl>
            <TextField
              type="email"
              fullWidth
              autoFocus
              margin="dense"
              name="email"
              id="email"
              label="이메일"
              inputRef={register({ required: true })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCloseDialog('disableAccount')} color="primary">
              닫기
            </Button>
            <Button type="submit" color="primary">
              적용
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
}
