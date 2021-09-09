import React, { useState, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Grid, Typography, TextField } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ko';
import useStyles from './Notice.css';
import { functions } from 'configs/firebase';
import { FirebaseUploadAdapter } from 'utils';
import { LoadingButton } from 'components';

export default function Notice() {
  const classes = useStyles();
  const history = useHistory();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();

  const createNotice = useCallback(async (newItem) => {
    const _createNotice = functions.httpsCallable('notice-createArticle');
    try {
      await _createNotice(newItem);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const updateNotice = useCallback(async (newItem, id) => {
    const _updateNotice = functions.httpsCallable('notice-updateArticle');
    try {
      await _updateNotice({ newItem, id });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSubmitNotice = useCallback(
    async (data) => {
      setLoading(true);

      const { title, ckeditorData } = data;

      if (!ckeditorData) {
        setLoading(false);
        return false;
      }

      const newItem = {
        title,
        data: ckeditorData,
      };

      if (state) {
        await updateNotice(newItem, state.article.id);
      } else {
        await createNotice(newItem);
      }

      setLoading(false);

      history.push({
        pathname: '/admin/notice',
      });
    },
    [createNotice, history, state, updateNotice],
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" className={classes.header}>
          공지사항 {state ? '수정' : '작성'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form autoComplete="off" onSubmit={handleSubmit(handleSubmitNotice)}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<DoneIcon />}
            loading={loading}
          >
            {state ? '수정하기' : '올리기'}
          </LoadingButton>
          <TextField
            label="제목"
            fullWidth
            margin="normal"
            name="title"
            defaultValue={state && state.article.title}
            inputRef={register({
              required: 'Required',
            })}
          />
          <CKEditor
            name="title"
            inputRef={register}
            editor={ClassicEditor}
            config={{
              language: 'ko',
            }}
            data={state ? state.article.data : ''}
            onInit={(editor) => {
              register('ckeditorData');

              const data = editor.getData();
              setValue('ckeditorData', data);
              editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                return new FirebaseUploadAdapter(loader);
              };
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setValue('ckeditorData', data);
            }}
            onBlur={(event, editor) => {
              console.log('Blur.', editor);
            }}
            onFocus={(event, editor) => {
              console.log('Focus.', editor);
            }}
          />
        </form>
      </Grid>
    </Grid>
  );
}
