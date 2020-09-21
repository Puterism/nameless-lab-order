import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@material-ui/core';
import useStyles from './OrderStatus.css';
import { currencyFormat } from 'utils';

export default function OrderStatusDetail(props) {
  const classes = useStyles();
  const { data } = props;
  const { items, total, subtotal, tax_rate } = data;

  return (
    <div className={classes.detailContainer}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="발주 상세 내역">
          <TableHead>
            <TableRow>
              <TableCell>품목</TableCell>
              <TableCell align="right">수량</TableCell>
              <TableCell align="right">단가</TableCell>
              <TableCell align="right">부가세</TableCell>
              <TableCell align="right">합계 (부가세 포함)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const { id, name, price, orderQuantity } = item;
              return (
                <TableRow key={id}>
                  <TableCell>{name}</TableCell>
                  <TableCell align="right">{orderQuantity}</TableCell>
                  <TableCell align="right">{currencyFormat(price)}</TableCell>
                  <TableCell align="right">{currencyFormat(price * orderQuantity * tax_rate)}</TableCell>
                  <TableCell align="right">{currencyFormat(price * orderQuantity)}</TableCell>
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
              <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>부가세 ({`${(tax_rate * 100).toFixed(0)} %`})</TableCell>
              <TableCell align="right">{currencyFormat(total * tax_rate)}</TableCell>
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
      <Box className={classes.detailControl}>{props.children}</Box>
    </div>
  );
}

OrderStatusDetail.defaultProps = {};
