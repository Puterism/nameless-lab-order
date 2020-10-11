import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import { currencyFormat } from 'utils';
import { Typography } from '@material-ui/core';
import useStyles from './Dashboard.css';

export default function RecentOrders({ data }) {
  const classes = useStyles();

  return (
    <>
      <Title>최근 주문</Title>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>주문번호</TableCell>
            <TableCell>발주처</TableCell>
            <TableCell>발주일시</TableCell>
            <TableCell>총합계</TableCell>
            <TableCell>상태</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => {
              const { id, client_name, created_at, total, status } = item;
              const date = created_at.toDate();
              const formatDate = dayjs(date).format('YYYY/MM/DD HH:mm:ss');
              return (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{client_name}</TableCell>
                  <TableCell>{formatDate}</TableCell>
                  <TableCell>{currencyFormat(total)}</TableCell>
                  <TableCell>{status}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography varient="p" component="p" className={classes.textAlignCenter}>
                  최근 주문 내역이 없습니다.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link component={RouterLink} to="/admin/order-status">
          발주 현황으로 이동
        </Link>
      </div>
    </>
  );
}
