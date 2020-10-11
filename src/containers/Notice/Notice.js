import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ScheduleIcon from '@material-ui/icons/Schedule';
import useStyles from './Notice.css';

export default function Notice() {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography varient="h5" component="h2" className={classes.header}>
          공지사항
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          component={Link}
          to="/admin/notice/write"
          variant="contained"
          color="primary"
        >
          공지사항 작성
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="발주 시스템을 오픈했습니다."
            titleTypographyProps={{
              gutterBottom: true,
            }}
            subheader="2020년 10월 11일"
          />
          <CardContent>
            {/* <Typography gutterBottom variant="h5" component="h2">
            </Typography>
            <Typography gutterBottom color="textSecondary" component="p">
              <ScheduleIcon fontSize="small" />
              <Typography component="span">2020년 10월 11일</Typography>
            </Typography> */}
            <Typography variant="body2" component="p">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="발주 시스템을 오픈했습니다."
            titleTypographyProps={{
              gutterBottom: true,
            }}
            subheader="2020년 10월 11일"
          />
          <CardContent>
            {/* <Typography gutterBottom variant="h5" component="h2">
            </Typography>
            <Typography gutterBottom color="textSecondary" component="p">
              <ScheduleIcon fontSize="small" />
              <Typography component="span">2020년 10월 11일</Typography>
            </Typography> */}
            <Typography variant="body2" component="p">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
