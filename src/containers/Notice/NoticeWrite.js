import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  TextField,
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Image from '@ckeditor/ckeditor5-image/src/image';
// import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
// import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
// import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
// import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
// import '@ckeditor/ckeditor5-image/theme'
import '@ckeditor/ckeditor5-build-classic/build/translations/ko';
import useStyles from './Notice.css';
import { firebase } from 'configs/firebase';

class FirebaseUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          let storage = firebase.storage().ref();
          let uploadTask = storage.child(file.name).put(file);
          uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function (snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            },
            function (error) {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              // eslint-disable-next-line default-case
              switch (error.code) {
                case 'storage/unauthorized':
                  reject(" User doesn't have permission to access the object");
                  break;

                case 'storage/canceled':
                  reject('User canceled the upload');
                  break;

                case 'storage/unknown':
                  reject(
                    'Unknown error occurred, inspect error.serverResponse',
                  );
                  break;
              }
            },
            function () {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                  // console.log("File available at", downloadURL);
                  resolve({
                    default: downloadURL,
                  });
                });
            },
          );
        }),
    );
  }
}

export default function Notice() {
  const classes = useStyles();
  const [ckeditorData, setCkeditorData] = useState(null);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    // TODO : 글 업로드
  }, []);

  useEffect(() => {
    console.log(ckeditorData);
  }, [ckeditorData]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography varient="h5" component="h2" className={classes.header}>
          공지사항
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<DoneIcon />}
          >
            올리기
          </Button>
          <TextField label="제목" fullWidth margin="normal" />
          <CKEditor
            editor={ClassicEditor}
            plugin={[Image]}
            config={{
              language: 'ko',
            }}
            data="<p>Hello from CKEditor 5!</p>"
            onInit={(editor) => {
              const data = editor.getData();
              setCkeditorData(data);
              editor.plugins.get('FileRepository').createUploadAdapter = (
                loader,
              ) => {
                return new FirebaseUploadAdapter(loader);
              };
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setCkeditorData(data);
              console.log({ event, editor, data });
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
