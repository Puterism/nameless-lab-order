import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Button,
  Typography,
  TextField,
  Paper,
  Divider,
  CircularProgress,
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import useStyles from './Order.css';
import { LoadingButton } from 'base.css';
import { fetchOrderableItem, createOrder } from 'api';
import { currencyFormat } from 'utils';
import useAlert from 'hooks/useAlert';

const TAX_RATE = 0.1;

export default function Order() {
  const classes = useStyles();
  const history = useHistory();
  const { openAlert, renderAlert } = useAlert();

  const [data, setData] = useState([]);
  const [basket, setBasket] = useState([]);
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => {
    let sum = 0;

    basket.forEach((basketItem) => {
      const { price, orderQuantity } = basketItem;
      if (!orderQuantity) {
        sum += price * 0;
      } else {
        sum += price * orderQuantity;
      }
    });

    return sum;
  }, [basket]);

  const handleChangeQuantity = useCallback((e) => {
    e.persist();
    setData((prevState) => {
      const nextState = [...prevState];
      const index = nextState.findIndex((item) => item.id === e.target.name);
      if (index >= 0) {
        if (!nextState[index].orderQuantity || nextState[index].orderQuantity <= 0) {
          nextState[index].orderQuantity = 1;
        } else if (nextState[index].orderQuantity > nextState[index].quantity) {
          nextState[index].orderQuantity = nextState[index].quantity;
        } else {
          nextState[index].orderQuantity = parseInt(e.target.value);
        }
      }
      return nextState;
    });
  }, []);

  const handleChangeQuantityBasket = useCallback((e) => {
    e.persist();
    setBasket((prevState) => {
      const nextState = [...prevState];
      const index = nextState.findIndex((item) => item.id === e.target.name);
      if (index >= 0) {
        if (!nextState[index].orderQuantity || nextState[index].orderQuantity <= 0) {
          nextState[index].orderQuantity = 1;
        } else if (nextState[index].orderQuantity > nextState[index].quantity) {
          nextState[index].orderQuantity = nextState[index].quantity;
        } else {
          nextState[index].orderQuantity = parseInt(e.target.value);
        }
      }
      return nextState;
    });
  }, []);

  const addToBasket = useCallback((item) => {
    setBasket((prevState) => {
      const nextState = [...prevState];
      const newItem = { ...item };
      const index = nextState.findIndex((basketItem) => basketItem.id === newItem.id);
      if (index >= 0) {
        nextState[index].orderQuantity += newItem.orderQuantity;
      } else {
        if (newItem.orderQuantity > 0) {
          nextState.push(newItem);
        }
      }
      return nextState;
    });
  }, []);

  const removeToBasket = useCallback((id) => {
    setBasket((prevState) => {
      const nextState = prevState.filter((item) => item.id !== id);
      return nextState;
    });
  }, []);

  const getItemData = useCallback(async () => {
    setLoading(true);
    let fetchedData = await fetchOrderableItem();
    fetchedData.forEach((item) => {
      item.orderQuantity = 1;
    });
    setData(fetchedData);
    setLoading(false);
  }, []);

  const basketOrder = useCallback(async () => {
    setLoading(true);
    // const { email, displayName, uid } = user;
    // const clientUser = {
    //   client_name: displayName,
    //   client_account_email: email,
    //   client_account_uid: uid,
    // };

    try {
      // const orderNumber = await createOrder(basket, clientUser);
      const orderNumber = await createOrder(basket);
      setBasket([]);
      history.push({
        pathname: '/order-status',
        state: {
          recentlyOrderNumber: orderNumber,
        },
      });
      openAlert('발주되었습니다', 'success');
    } catch (err) {
      console.error(err.message);
      openAlert(err.message, 'error');
    }
    setLoading(false);
  }, [basket, openAlert, history]);

  useEffect(() => {
    getItemData();
    return () => {
      setLoading(false);
      setData([]);
    };
  }, [getItemData]);

  return (
    <Grid container spacing={3}>
      {basket.length > 0 && (
        <>
          <Grid item xs={12}>
            <Typography varient="h5" component="h2" className={classes.header}>
              장바구니
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="장바구니" className={classes.basketTable}>
                <TableHead>
                  <TableRow>
                    <TableCell>품목명</TableCell>
                    <TableCell align="right">단가</TableCell>
                    <TableCell align="right">수량</TableCell>
                    <TableCell align="right">합계</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {basket.length > 0 &&
                    basket.map((basketItem) => {
                      const { id, name, price, quantity, orderQuantity } = basketItem;
                      return (
                        <TableRow key={name}>
                          <TableCell>{name}</TableCell>
                          <TableCell align="right">{currencyFormat(price)}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              margin="dense"
                              variant="outlined"
                              className={classes.orderQuantity}
                              InputProps={{ inputProps: { min: 1, max: quantity } }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              name={id}
                              value={orderQuantity}
                              onChange={handleChangeQuantityBasket}
                              onBlur={handleChangeQuantityBasket}
                            />
                          </TableCell>
                          <TableCell align="right">{currencyFormat(price * (orderQuantity ? orderQuantity : 0))}</TableCell>
                          <TableCell align="right">
                            <Button startIcon={<DeleteIcon />} className={classes.deleteButton} onClick={() => removeToBasket(id)}>
                              삭제
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  <TableRow>
                    <TableCell rowSpan={5} colSpan={3} />
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>부가세 제외</TableCell>
                    <TableCell align="right">{currencyFormat(total * (1 - TAX_RATE))}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>부가세 {`(${(TAX_RATE * 100).toFixed(0)} %)`}</TableCell>
                    <TableCell align="right">{currencyFormat(total * TAX_RATE)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.bold}>총합계</TableCell>
                    <TableCell align="right" className={classes.bold}>
                      {currencyFormat(total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              fullWidth
              loading={loading}
              variant="contained"
              size="large"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={basketOrder}
            >
              발주하기
            </LoadingButton>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Typography varient="h5" component="h2" className={classes.header}>
          발주 가능한 품목 목록
        </Typography>
      </Grid>
      {data &&
        data.length > 0 &&
        data.map((item) => {
          const { id, name, price, quantity, orderQuantity } = item;
          return (
            <Grid key={name} item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3" className={classes.bold}>
                    {name}
                  </Typography>
                  <Typography variant="h5" component="p" gutterBottom>
                    {currencyFormat(price)}
                  </Typography>
                  <Typography color="textSecondary" component="p">
                    발주 가능 수량 {quantity}개
                  </Typography>
                </CardContent>
                <CardContent>
                  <TextField
                    type="number"
                    margin="dense"
                    variant="outlined"
                    label="수량 선택"
                    className={classes.orderQuantity}
                    disabled={basket.findIndex((basketItem) => basketItem.id === id) >= 0}
                    InputProps={{ inputProps: { min: 1, max: quantity } }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    name={id}
                    value={orderQuantity}
                    onChange={handleChangeQuantity}
                    onBlur={handleChangeQuantity}
                  />
                </CardContent>
                <CardActions className={classes.cardActions}>
                  {basket.findIndex((basketItem) => basketItem.id === id) < 0 ? (
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      className={classes.cardButton}
                      onClick={() => addToBasket(item)}
                    >
                      장바구니 추가
                    </Button>
                  ) : (
                    <Button variant="contained" size="large" color="primary" disabled className={classes.cardButton}>
                      장바구니에 추가됨
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      {data && data.length <= 0 && !loading && (
        <Grid item xs={12}>
          <p>현재 발주 가능한 품목이 없습니다.</p>
        </Grid>
      )}
      {data.length <= 0 && loading && (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}

      {renderAlert}
    </Grid>
  );
}
