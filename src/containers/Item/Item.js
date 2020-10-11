import React, { useState, useEffect } from 'react';
import { Grid, FormControlLabel, Switch } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import MaterialTable from 'material-table';
import useStyles from './Item.css';
import { options, localization } from './itemTableOptions';
import { createItem, updateItem, deleteItem } from 'api';
import { currencyFormat } from 'utils';
import { firestore } from 'configs/firebase';

export default function Item() {
  const classes = useStyles();
  const [data, setData] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const columns = [
    {
      title: '품목명',
      field: 'name',
      validate: (rowData) =>
        rowData.name === ''
          ? {
              isValid: false,
              helperText: '품목명을 입력해주세요',
            }
          : true,
    },
    {
      title: '단가 (부가세 포함)',
      field: 'price',
      type: 'currency',
      initialEditValue: 0,
      validate: (rowData) =>
        rowData.price < 0 || isNaN(rowData.price)
          ? {
              isValid: false,
              helperText: '0 이상의 숫자를 입력해주세요',
            }
          : true,
      render: (rowData) => {
        const { price } = rowData;
        return currencyFormat(price);
      },
    },
    {
      title: '재고 수량',
      field: 'quantity',
      type: 'numeric',
      initialEditValue: 1,
      validate: (rowData) =>
        rowData.quantity < 0 || isNaN(rowData.quantity)
          ? {
              isValid: false,
              helperText: '0 이상의 숫자를 입력해주세요',
            }
          : true,
    },
    {
      title: '발주 가능 여부',
      field: 'available',
      type: 'boolean',
      initialEditValue: false,
      render: (rowData) => {
        const { available } = rowData;
        return (
          <>
            {available ? (
              <>
                <CheckIcon className={classes.verticalAlignMiddle} />
                <span className={classes.verticalAlignMiddle}>가능</span>
              </>
            ) : (
              <>
                <ClearIcon className={classes.verticalAlignMiddle} />
                <span className={classes.verticalAlignMiddle}>불가능</span>
              </>
            )}
          </>
        );
      },
      editComponent: (props) => {
        const { available } = props.rowData;
        return (
          <FormControlLabel
            label={available ? '가능' : '불가능'}
            value={available ? true : false}
            control={
              <Switch
                color="primary"
                checked={available ? 'checked' : ''}
                value={available ? true : false}
              />
            }
            onChange={(event) => props.onChange(event.target.checked)}
          />
        );
      },
    },
  ];

  // const getItemData = useCallback(async () => {
  //   setIsFetching(true);
  //   const fetchedData = await fetchItems();
  //   setData(fetchedData);
  //   setIsFetching(false);
  // }, []);

  // useEffect(() => {
  //   getItemData();
  // }, [getItemData]);

  useEffect(() => {
    setIsFetching(true);
    const unsubscribe = firestore
      .collection('item')
      .orderBy('created_at', 'asc')
      .onSnapshot(
        (snapshot) => {
          const itemData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(itemData);
          setIsFetching(false);
        },
        (err) => {
          console.error(err);
        },
      );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MaterialTable
          title="품목 관리"
          columns={columns}
          data={data}
          isLoading={isFetching}
          options={options}
          localization={localization}
          editable={{
            onRowAdd: async (item) => {
              try {
                await createItem(item);
                // TODO: success alert
              } catch (err) {
                console.error(err);
                // TODO: error alert
              }
            },
            onRowUpdate: async (item) => {
              try {
                await updateItem(item);
                // TODO: success alert
              } catch (err) {
                console.error(err);
                // TODO: error alert
              }
            },
            onRowDelete: async (item) => {
              try {
                const { id } = item;
                await deleteItem(id);
                // TODO: success alert
              } catch (err) {
                console.error(err);
                // TODO: error alert
              }
            },
            // onRowAdd: (item) =>
            //   new Promise(async (resolve, reject) => {
            //     const result = await createItem(item);
            //     if (result) {
            //       setData((prevState) => {
            //         const newData = [...prevState];
            //         const newItem = { ...item };
            //         newItem.id = result.id;
            //         newData.push(newItem);
            //         return newData;
            //       });
            //     } else {
            //       reject();
            //     }
            //     resolve();
            //   }),
            // onRowUpdate: (item, before) =>
            //   new Promise(async (resolve, reject) => {
            //     if (before !== item) {
            //       const success = await updateItem(item);
            //       if (success) {
            //         setData((prevState) => {
            //           const newData = [...prevState];
            //           newData[newData.indexOf(before)] = item;
            //           return newData;
            //         });
            //       } else {
            //         reject();
            //       }
            //     }
            //     resolve();
            //   }),
            // onRowDelete: (item) =>
            //   new Promise(async (resolve, reject) => {
            //     const { id } = item;
            //     const success = await deleteItem(id);
            //     if (success) {
            //       setData((prevState) => {
            //         const newData = [...prevState];
            //         newData.splice(newData.indexOf(item), 1);
            //         return newData;
            //       });
            //     } else {
            //       reject();
            //     }
            //     resolve();
            //   }),
          }}
        />
      </Grid>
    </Grid>
  );
}
