import React, { useState, useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import useStyles from './Setting.css';
import { LoadingButton } from 'components';
import useAlert from 'hooks/useAlert';
import UserContext from 'contexts/UserContext';
import { updateProfile, changePassword } from 'api';

export default function Setting() {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const { user } = useContext(UserContext);
  const { openAlert, renderAlert } = useAlert();

  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState({
    updateProfile: false,
    updateEmail: false,
    changePassword: false,
  });

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

  const handleSubmitUpdateProfile = useCallback(
    async (data) => {
      setLoading(true);
      const { displayName } = data;
      console.log(displayName);
      try {
        await updateProfile(data);
        openAlert('계정 정보가 수정되었습니다.', 'success');
      } catch (err) {
        openAlert(err.message, 'error');
      }
      handleCloseDialog('updateProfile');
      setLoading(false);
    },
    [handleCloseDialog, openAlert],
  );

  const handleSubmitUpdateEmail = useCallback(
    async (data) => {
      setLoading(true);
      const { email } = data;
      console.log(email);
      handleCloseDialog('updateEmail');
      setLoading(false);
      // TODO
    },
    [handleCloseDialog],
  );

  const handleSubmitChangePassword = useCallback(
    async (data) => {
      setLoading(true);
      const { currentPassword, newPassword, newPasswordVerify } = data;
      if (newPassword !== newPasswordVerify) {
        openAlert('새로운 비밀번호를 올바르게 재입력해주세요.', 'error'); // TODO: TextField에 에러 메시지 표시
        return;
      }
      try {
        await changePassword(currentPassword, newPassword);
        openAlert('비밀번호가 변경되었습니다.', 'success');
        handleCloseDialog('changePassword');
      } catch (err) {
        openAlert(err.message, 'error');
      }
      setLoading(false);
    },
    [handleCloseDialog, openAlert],
  );

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
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => handleClickOpenDialog('updateProfile')}
            >
              정보 수정
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              이메일 주소 변경
            </Typography>
            <Typography component="p" gutterBottom>
              로그인에 사용되는 이메일 주소를 변경합니다.
            </Typography>
          </CardContent>
          <CardContent>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => handleClickOpenDialog('updateEmail')}
            >
              이메일 주소 변경
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
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => handleClickOpenDialog('changePassword')}
            >
              비밀번호 변경
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {renderAlert}

      <Dialog
        open={dialogOpen.updateProfile}
        onClose={() => handleCloseDialog('updateProfile')}
        aria-labelledby="create-account-edit-profile"
      >
        <form onSubmit={handleSubmit(handleSubmitUpdateProfile)}>
          <DialogTitle id="create-account-edit-profile">
            계정 정보 수정
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              수정할 정보를 입력하고 수정하기 버튼을 눌러주세요.
            </DialogContentText>
            <TextField
              type="text"
              fullWidth
              margin="dense"
              name="displayName"
              id="displayName"
              label="발주처명"
              autoFocus
              defaultValue={user.displayName}
              inputRef={register({ required: true })}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleCloseDialog('updateProfile')}
              color="primary"
            >
              닫기
            </Button>
            <LoadingButton type="submit" loading={loading} color="primary">
              수정하기
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={dialogOpen.updateEmail}
        onClose={() => handleCloseDialog('updateEmail')}
        aria-labelledby="create-account-update-email"
      >
        <form onSubmit={handleSubmit(handleSubmitUpdateEmail)}>
          <DialogTitle id="create-account-update-email">
            이메일 주소 변경
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              로그인에 사용되는 이메일 주소를 변경합니다.
            </DialogContentText>
            <TextField
              type="email"
              fullWidth
              margin="dense"
              name="email"
              id="email"
              label="이메일"
              defaultValue={user.email}
              inputRef={register({ required: true })}
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleCloseDialog('updateEmail')}
              color="primary"
            >
              닫기
            </Button>
            <LoadingButton type="submit" loading={loading} color="primary">
              변경하기
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={dialogOpen.changePassword}
        onClose={() => handleCloseDialog('changePassword')}
        aria-labelledby="change-password-dialog-title"
      >
        <form onSubmit={handleSubmit(handleSubmitChangePassword)}>
          <DialogTitle id="change-password-dialog-title">
            비밀번호 변경
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              현재 비밀번호와 새로 변경할 비밀번호를 입력해주세요
            </DialogContentText>
            <TextField
              type="password"
              fullWidth
              margin="dense"
              name="currentPassword"
              id="currentPassword"
              label="현재 비밀번호"
              autoFocus
              inputRef={register({ required: true })}
            />
            <TextField
              type="password"
              fullWidth
              margin="dense"
              name="newPassword"
              id="newPassword"
              label="새로운 비밀번호"
              inputRef={register({ required: true })}
            />
            <TextField
              type="password"
              fullWidth
              margin="dense"
              name="newPasswordVerify"
              id="newPasswordVerify"
              label="새로운 비밀번호 재입력"
              inputRef={register({ required: true })}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleCloseDialog('changePassword')}
              color="primary"
            >
              닫기
            </Button>
            <LoadingButton type="submit" loading={loading} color="primary">
              비밀번호 변경
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
}
