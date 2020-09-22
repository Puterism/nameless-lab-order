import React, { useState, useCallback } from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function useAlert() {
  const [alertStatus, setAlertStatus] = useState({
    open: false,
    severity: 'info',
    message: '',
  });

  const openAlert = useCallback((message, severity) => {
    setAlertStatus((prevState) => {
      let newAlert = { ...prevState };
      newAlert.open = true;
      newAlert.message = message;
      newAlert.severity = severity;
      return newAlert;
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertStatus((prevState) => {
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

  const renderAlert = (
    <Snackbar open={alertStatus.open} autoHideDuration={3000} onClose={handleAlertClose}>
      <Alert onClose={handleAlertClose} severity={alertStatus.severity}>
        {alertStatus.message}
      </Alert>
    </Snackbar>
  );

  return { openAlert, renderAlert };
}
