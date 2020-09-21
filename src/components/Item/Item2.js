import React, { useState, useEffect, useCallback } from 'react';
import { Grid, FormControlLabel, Switch, Button, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import MUIDataTable from 'mui-datatables';
import { firestore } from 'configs/firebase';
import useInputs from 'hooks/useInputs';
import useStyles from './Item.css';
import { Loading } from 'components';

export default function Item() {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);

  const initialFormState = {
    name: '',
    price: '',
    quantity: '',
    soldout: false,
  };

  const [formState, setFormState] = useState(initialFormState);

  // const [formState, onChange, setFormState] = useInputs({
  //   name: '',
  //   price: '',
  //   quantity: '',
  //   soldout: false,
  // });

  const { name, price, quantity, soldout } = formState;

  const handleChange = useCallback(
    (event) => {
      setFormState({
        ...formState,
        [event.target.name]: event.target.value,
      });
    },
    [formState],
  );

  const handleDialogOpen = useCallback(() => {
    setFormState(initialFormState);
    setDialogOpen(true);
  }, [formState, initialFormState]);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleClickEdit = useCallback(
    (index) => {
      const { name, price, quantity, soldout } = data[index];
      setEditing(index);

      setFormState({
        name,
        price,
        quantity,
        soldout,
      });
    },
    [data, setFormState],
  );

  const handleClickDelete = useCallback((index) => {
    setData((prevState) => {
      const newData = [...prevState];
      newData.splice(index, 1);
      return newData;
    });
  }, []);

  const handleClickEditSave = useCallback((index) => {
    setEditing(null);
  }, []);

  const saveItem = useCallback(async (item) => {
    try {
      const docRef = await firestore.collection('item').add(item);
      console.log('Document written with ID: ', docRef.id);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  }, []);

  const fetchItemData = useCallback(async () => {
    let data = [];

    const querySnapshot = await firestore.collection('item').get();
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      data.push(item);
    });

    return data;
  }, []);

  const getItemData = useCallback(async () => {
    const fetchedData = await fetchItemData();
    setData(fetchedData);
  }, [fetchItemData]);

  const columns = [
    {
      name: '',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <>
              <div style={{ display: editing === rowIndex ? 'none' : 'block' }}>
                <IconButton onClick={() => handleClickEdit(rowIndex)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleClickDelete(rowIndex)}>
                  <DeleteIcon />
                </IconButton>
              </div>
              <div style={{ display: editing === rowIndex ? 'block' : 'none' }}>
                <IconButton onClick={() => handleClickEditSave(rowIndex)}>
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={() => handleClickEdit(null)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </>
          );
        },
      },
    },
    {
      name: 'name',
      label: '품목명',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const { rowIndex } = tableMeta;
          return <>{editing === rowIndex ? <TextField size="small" type="text" name="name" value={name} onChange={handleChange} /> : value}</>;
        },
      },
    },
    {
      name: 'price',
      label: '단가',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const { rowIndex } = tableMeta;
          const nf = new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });

          return <>{editing === rowIndex ? <TextField size="small" type="number" name="price" value={price} onChange={handleChange} /> : nf.format(value)}</>;
        },
      },
    },
    {
      name: 'quantity',
      label: '수량',
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const { rowIndex } = tableMeta;
          return <>{editing === rowIndex ? <TextField size="small" type="number" name="quantity" value={quantity} onChange={handleChange} /> : value}</>;
        },
      },
    },
    {
      name: 'soldout',
      label: '품절 여부',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const { rowIndex } = tableMeta;
          return (
            <>
              <div style={{ display: editing === rowIndex ? 'none' : 'block' }}>
                {value ? (
                  <>
                    <CloseIcon className={classes.verticalAlignMiddle} />
                    <span className={classes.verticalAlignMiddle}>품절됨</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className={classes.verticalAlignMiddle} />
                    <span className={classes.verticalAlignMiddle}>판매 가능</span>
                  </>
                )}
              </div>
              <FormControlLabel
                style={{ display: editing === rowIndex ? 'block' : 'none' }}
                label={value ? '품절됨' : '판매 가능'}
                value={value ? 'Yes' : 'No'}
                control={<Switch color="primary" checked={value} value={value ? 'Yes' : 'No'} />}
                onChange={(event) => {
                  const index = tableMeta.rowIndex;
                  setData((prevState) => {
                    let newData = [...prevState];
                    newData[index].soldout = !value;
                    return newData;
                  });
                  updateValue(event.target.value === 'Yes' ? false : true);
                }}
              />
            </>
          );
        },
      },
    },
  ];

  const options = {
    enableNestedDataAccess: '.',
    download: false,
    filter: false,
    print: false,
    viewColumns: false,
    elevation: 1,
    responsive: 'vertical',
    textLabels: {
      body: {
        noMatch: '결과가 없습니다',
        toolTip: '정렬',
      },
      pagination: {
        next: '다음 페이지',
        previous: '이전 페이지',
        rowsPerPage: '페이지당 품목',
        displayRows: '의',
        jumpToPage: '페이지 이동:',
      },
      toolbar: {
        search: '검색',
        downloadCsv: 'CSV로 내보내기',
        print: '인쇄',
        viewColumns: '표시할 행',
        filterTable: '필터',
      },
      selectedRows: {
        text: '개의 품목 선택됨',
        delete: '품목 삭제',
        deleteAria: '선택된 품목 삭제',
      },
    },
  };

  useEffect(() => {
    getItemData();
  }, [getItemData]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <Grid container spacing={3}>
        {data && data.length > 0 ? (
          <>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                변경 사항 저장
              </Button>
              <Button variant="contained" color="primary" onClick={handleDialogOpen}>
                품목 추가
              </Button>
            </Grid>
            <Grid item xs={12}>
              <MUIDataTable title={'품목 관리'} data={data} columns={columns} options={options} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Loading />
          </Grid>
        )}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">품목 추가</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>품목을 추가합니다.</DialogContentText> */}
          <TextField autoFocus type="text" margin="dense" id="name" name="name" label="품목명" fullWidth value={name} onChange={handleChange} />
          <TextField type="number" margin="dense" id="price" name="price" label="단가(원)" fullWidth value={price} onChange={handleChange} />
          <TextField type="number" margin="dense" id="quantity" name="quantity" label="수량" fullWidth value={quantity} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            취소
          </Button>
          <Button onClick={() => saveItem(formState)} color="primary">
            등록
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
