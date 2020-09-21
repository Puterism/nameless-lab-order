import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import {
  Grid,
  Paper,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Typography,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import MaterialTable from 'material-table';
import { options, localization } from './orderTableOptions';
import useStyles, { CancelButton, ConfirmButton } from './OrderStatus.css';
import OrderStatusDetail from './OrderStatusDetail';
import ColorIndicator from './ColorIndicator';
import { cancelOrder, updateTrackingNumber, updateConfirmCompleted } from 'api';
import { orderStatus } from 'constants/index';
import { firestore } from 'configs/firebase';
import UserContext from 'contexts/UserContext';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function OrderStatus({ admin }) {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { ORDERED, SENT, COMPLETED, CANCELED } = orderStatus;

  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [dialogOpen, setDialogOpen] = useState({
    cancelOrderWithReason: false,
    enterTrackingNumber: false,
    confirmCompleted: false,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: 'info',
    message: '',
  });

  const columns = [
    {
      title: '주문번호',
      field: 'order_number',
    },
    {
      title: '발주처',
      field: 'client_name',
    },
    {
      title: '발주일시',
      field: 'created_at',
      render: (rowData) => {
        const { created_at } = rowData;
        const date = created_at.toDate();
        const formatDate = dayjs(date).format('YYYY/MM/DD HH:mm:ss');
        return formatDate;
      },
    },
    {
      title: '발송일시',
      field: 'shipping_started_at',
      render: (rowData) => {
        const { shipping_started_at } = rowData;
        if (shipping_started_at) {
          const date = shipping_started_at.toDate();
          const formatDate = dayjs(date).format('YYYY/MM/DD HH:mm:ss');
          return formatDate;
        }
        return null;
      },
    },
    {
      title: '운송장 번호',
      field: 'tracking_number',
    },
    {
      title: '상태',
      field: 'status',
      render: (rowData) => {
        const { status } = rowData;
        let color = 'gray';
        if (status === ORDERED) {
          color = 'orange';
        } else if (status === SENT) {
          color = 'blue';
        } else if (status === COMPLETED) {
          color = '#388e3c';
        } else if (status === CANCELED) {
          color = 'red';
        }
        return (
          <>
            <ColorIndicator color={color} />
            <span className={classes.bold}>{status}</span>
            {rowData.cancel_reason && (
              <Typography varient="h3" component="p">
                ({rowData.cancel_reason})
              </Typography>
            )}
          </>
        );
      },
    },
  ];

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

  const handleClickCancelOrder = useCallback(
    (orderNumber) => {
      setSelectedOrder(orderNumber);
      handleClickOpenDialog('cancelOrderWithReason');
    },
    [setSelectedOrder, handleClickOpenDialog],
  );

  const handleCancelOrder = useCallback(
    async (data) => {
      const { orderCancelReason } = data;
      try {
        await cancelOrder(orderCancelReason, selectedOrder);

        setData((prevState) => {
          const newData = [...prevState];
          const updatedOrderIndex = newData.findIndex((item) => item.id === selectedOrder);
          if (updatedOrderIndex >= 0) {
            newData[updatedOrderIndex].status = CANCELED;
            newData[updatedOrderIndex].cancel_reason = orderCancelReason;
          }
          return newData;
        });
        openAlert(`주문이 취소되었습니다. (${selectedOrder})`, 'info');
      } catch (err) {
        console.error(err);
        openAlert(err.message, 'error');
      }
      handleCloseDialog('cancelOrderWithReason');
      console.log('cancelOrder', orderCancelReason, selectedOrder);
    },
    [handleCloseDialog, selectedOrder, openAlert, CANCELED],
  );

  const handleClickEnterTrackingNumber = useCallback(
    (orderNumber) => {
      setSelectedOrder(orderNumber);
      handleClickOpenDialog('enterTrackingNumber');
    },
    [setSelectedOrder, handleClickOpenDialog],
  );

  const handleSubmitTrackingNumber = useCallback(
    async (data) => {
      const { trackingNumber } = data;
      try {
        await updateTrackingNumber(trackingNumber, selectedOrder);

        setData((prevState) => {
          const newData = [...prevState];
          const updatedOrderIndex = newData.findIndex((item) => item.id === selectedOrder);
          if (updatedOrderIndex >= 0) {
            newData[updatedOrderIndex].status = SENT;
            newData[updatedOrderIndex].tracking_number = trackingNumber;
          }
          return newData;
        });
        openAlert('운송장 번호가 입력되었습니다. 상태가 발송됨으로 변경됩니다.', 'success');
      } catch (err) {
        console.error(err);
        openAlert(err.message, 'error');
      }
      handleCloseDialog('enterTrackingNumber');
      console.log('enterTrackingNumber', trackingNumber, selectedOrder);
    },
    [handleCloseDialog, selectedOrder, openAlert, SENT],
  );

  const handleClickConfirmCompleted = useCallback(
    (orderNumber) => {
      setSelectedOrder(orderNumber);
      handleClickOpenDialog('confirmCompleted');
    },
    [setSelectedOrder, handleClickOpenDialog],
  );

  const handleSubmitConfirmCompleted = useCallback(async () => {
    try {
      await updateConfirmCompleted(selectedOrder);

      setData((prevState) => {
        const newData = [...prevState];
        const updatedOrderIndex = newData.findIndex((item) => item.id === selectedOrder);
        if (updatedOrderIndex >= 0) {
          newData[updatedOrderIndex].status = COMPLETED;
        }
        return newData;
      });
      openAlert(`수취 확인되었습니다. (${selectedOrder})`, 'success');
    } catch (err) {
      console.error(err);
      openAlert(err.message, 'error');
    }
    handleCloseDialog('confirmCompleted');
  }, [handleCloseDialog, selectedOrder, openAlert, COMPLETED]);

  // const getOrderData = useCallback(async () => {
  //   setIsFetching(true);
  //   const fetchedData = await fetchOrders();
  //   setData(fetchedData);
  //   setIsFetching(false);
  // }, []);

  // useEffect(() => {
  //   getOrderData();
  // }, [getOrderData]);

  useEffect(() => {
    setIsFetching(true);
    let orderRef = firestore.collection('order');
    if (!admin) {
      console.log(!admin);
      orderRef = firestore.collection('order').where('client_account_uid', '==', user.uid);
    }

    const unsubscribe = orderRef.onSnapshot(
      (snapshot) => {
        const orderData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(orderData);
        setIsFetching(false);
      },
      (err) => {
        console.error(err);
      },
    );

    return () => unsubscribe();
  }, [admin, user.uid]);

  useEffect(() => {
    if (location.state && location.state.recentlyOrderNumber) {
      openAlert(`발주되었습니다. 주문번호는 ${location.state.recentlyOrderNumber}입니다.`, 'success');
    }
  }, [location.state, openAlert]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper>
          <MaterialTable
            title="발주 현황"
            columns={columns}
            data={data}
            isLoading={isFetching}
            detailPanel={(rowData) => {
              const { status, tracking_number } = rowData;
              return (
                <OrderStatusDetail data={rowData}>
                  {admin && status !== CANCELED && status !== COMPLETED && (
                    <Button variant="contained" color="primary" onClick={() => handleClickEnterTrackingNumber(rowData.order_number)}>
                      운송장 번호 {!tracking_number ? '입력' : '수정'}
                    </Button>
                  )}
                  {((!admin && status !== SENT && status !== COMPLETED) || admin) && (
                    <CancelButton variant="contained" startIcon={<CancelIcon />} onClick={() => handleClickCancelOrder(rowData.id)}>
                      주문 취소 {status === CANCELED && '사유 수정'}
                    </CancelButton>
                  )}
                  {!admin && status === SENT && (
                    <ConfirmButton variant="contained" startIcon={<CheckIcon />} onClick={() => handleClickConfirmCompleted(rowData.id)}>
                      수취 확인
                    </ConfirmButton>
                  )}
                </OrderStatusDetail>
              );
            }}
            options={options}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
            onChangePage={() => console.log('onChangePage')}
            localization={localization}
          />
        </Paper>
      </Grid>
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={dialogOpen.cancelOrderWithReason}
        onClose={() => handleCloseDialog('cancelOrderWithReason')}
        aria-labelledby="cancel-order-dialog-title"
      >
        <form onSubmit={handleSubmit(handleCancelOrder)}>
          <DialogTitle id="cancel-order-dialog-title">주문 취소 ({selectedOrder})</DialogTitle>
          <DialogContent>
            <DialogContentText>주문을 취소하는 사유를 입력해주세요. 입력한 사유는 발주처에서도 확인할 수 있습니다.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="orderCancelReason"
              id="order-cancel-reason"
              label="주문 취소 사유"
              type="text"
              fullWidth
              inputRef={register({
                required: 'Required',
              })}
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => handleCloseDialog('cancelOrderWithReason')} color="primary">
              닫기
            </Button>
            <CancelButton type="submit" variant="contained" color="primary">
              주문 취소
            </CancelButton>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={dialogOpen.enterTrackingNumber}
        onClose={() => handleCloseDialog('enterTrackingNumber')}
        aria-labelledby="enter-tracking-number-title"
      >
        <form onSubmit={handleSubmit(handleSubmitTrackingNumber)}>
          <DialogTitle id="enter-tracking-number-title">운송장 번호 입력 ({selectedOrder})</DialogTitle>
          <DialogContent>
            <DialogContentText>
              운송장 번호를 입력하면 발주 상태가 <b>발송됨</b>으로 변경됩니다. 또한 입력된 시간이 발송일시로 저장됩니다.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="trackingNumber"
              id="tracking-number"
              label="운송장 번호"
              type="text"
              fullWidth
              inputRef={register({
                required: 'Required',
              })}
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => handleCloseDialog('enterTrackingNumber')} color="primary">
              닫기
            </Button>
            <Button type="submit" variant="contained" color="primary">
              운송장 입력
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={dialogOpen.confirmCompleted}
        onClose={() => handleCloseDialog('confirmCompleted')}
        aria-labelledby="confirm-completed-title"
      >
        <form onSubmit={handleSubmit(handleSubmitConfirmCompleted)}>
          <DialogTitle id="confirm-completed-title">수취 확인 ({selectedOrder})</DialogTitle>
          <DialogContent>
            <DialogContentText>발주한 상품들을 잘 받으셨나요?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <ConfirmButton type="submit" variant="contained" color="primary">
              네 (수취 확인)
            </ConfirmButton>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
}
