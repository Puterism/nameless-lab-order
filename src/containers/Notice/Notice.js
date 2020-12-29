import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import dayjs from 'dayjs';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import useStyles from './Notice.css';
import { firebase, firestore } from 'configs/firebase';

export default function Notice({ admin }) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleClickArticleMenu = (event, article) => {
    setAnchorEl(event.currentTarget);
    setSelectedArticle(article);
  };

  const handleCloseArticleMenu = () => {
    setAnchorEl(null);
    setSelectedArticle(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteNotice = async (id) => {
    const _deleteNotice = firebase.functions().httpsCallable('notice-deleteArticle');
    try {
      await _deleteNotice({ id });
      handleCloseArticleMenu();
      handleCloseDeleteDialog();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore
      .collection('notice')
      .orderBy('created_at', 'desc')
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(data);
          setLoading(false);
        },
        (err) => {
          console.error(err);
        },
      );

    return () => unsubscribe();
  }, []);

  // TODO: onSnapshot으로 변경 & 삭제 구현
  // const getNotices = useCallback(async () => {
  //   setLoading(true);
  //   const _getNotices = firebase.functions().httpsCallable('getNotices');
  //   try {
  //     const response = await _getNotices();
  //     console.log(response.data);
  //     setData(response.data);
  //     setLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, []);

  // useEffect(() => {
  //   getNotices();
  // }, [getNotices]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography varient="h5" component="h2" className={classes.header}>
          공지사항
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button component={Link} to="/admin/notice/write" variant="contained" color="primary">
          공지사항 작성
        </Button>
      </Grid>
      {data.length <= 0 && loading && (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}
      {(!data || data.length <= 0) && !loading && (
        <Grid item xs={12}>
          <p>작성된 공지사항이 없습니다.</p>
        </Grid>
      )}
      {data?.map((item) => {
        const { title, created_at, data } = item;
        const date = dayjs(created_at.toDate()).format('YYYY년 MM월 DD일');
        return (
          <Grid item xs={12} key={title}>
            <Card>
              <CardHeader
                action={
                  admin && (
                    <IconButton
                      aria-label="settings"
                      aria-controls={`notice-article-menu`}
                      aria-haspopup="true"
                      onClick={(event) => handleClickArticleMenu(event, item)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )
                }
                title={title}
                titleTypographyProps={{
                  gutterBottom: true,
                }}
                subheader={date}
              />
              <CardContent>
                {/* <Typography gutterBottom variant="h5" component="h2">
                </Typography>
                <Typography gutterBottom color="textSecondary" component="p">
                  <ScheduleIcon fontSize="small" />
                  <Typography component="span">2020년 10월 11일</Typography>
                </Typography> */}
                <Typography
                  variant="body2"
                  component="p"
                  className="ck-content"
                  dangerouslySetInnerHTML={{ __html: data }}
                ></Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
      <Menu id="notice-article-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleCloseArticleMenu}>
        <MenuItem
          component={Link}
          to={{
            pathname: '/admin/notice/write',
            state: {
              article: selectedArticle,
            },
          }}
          variant="contained"
          color="primary"
        >
          <EditIcon className={classes.articleMenuIcon} />
          수정
        </MenuItem>
        <MenuItem className={classes.articleMenuItemDelete} onClick={handleOpenDeleteDialog}>
          <DeleteForeverIcon className={classes.articleMenuIcon} />
          삭제
        </MenuItem>
      </Menu>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">이 공지사항을 정말로 삭제하시겠습니까?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            공지사항을 삭제하면 다시 복원할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            취소
          </Button>
          <Button onClick={() => handleDeleteNotice(selectedArticle.id)} className={classes.articleMenuItemDelete}>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
