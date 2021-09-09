import { firebase, firestore, functions } from 'configs/firebase';
import { generateOrderNumber } from 'utils';
import { orderStatus } from 'constants/index';

const TAX_RATE = 0.1;

export const fetchAdminCustomClaim = async (uid) => {
  const getAdminCustomClaim = functions.httpsCallable('getAdminCustomClaim');
  try {
    const adminCustomClaim = await getAdminCustomClaim(uid);
    console.log(adminCustomClaim);
    return adminCustomClaim;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/***** Account *****/
export const updateAccountName = async (user, name) => {
  user
    .updateProfile({
      displayName: name,
    })
    .then((response) => {
      // Update successful.
      console.log(response);
    })
    .catch((err) => {
      // An error happened.
      console.error(err);
    });
};

export const createAccount = async (name, email, password) => {
  const createUser = functions.httpsCallable('createAccount');

  try {
    const response = await createUser({ displayName: name, email, password });
    console.log(response);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return true;
};

export const grantAdmin = async (email) => {
  const setAdmin = functions.httpsCallable('setAdmin');

  try {
    const response = await setAdmin(email);
    console.log(response);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return true;
};

export const releaseAdmin = async (email) => {
  const unsetAdmin = functions.httpsCallable('unsetAdmin');

  try {
    const response = await unsetAdmin(email);
    console.log(response);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return true;
};

export const disableAccount = async (email) => {
  const disableUser = functions.httpsCallable('disableUser');

  try {
    const response = await disableUser(email);
    console.log(response);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return true;
};

export const enableAccount = async (email) => {
  const enableUser = functions.httpsCallable('enableUser');

  try {
    const response = await enableUser(email);
    console.log(response);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return true;
};

export const fetchProfile = async () => {
  const user = firebase.auth().currentUser;

  return user;
};

/***** END Account *****/

/***** Item *****/
export const fetchItems = async () => {
  let items = [];
  try {
    const querySnapshot = await firestore.collection('item').orderBy('created_at', 'asc').get();
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      item.id = doc.id;
      items.push(item);
    });
    console.log('fetchItems');
  } catch (err) {
    console.error('Error fetch document: ', err);
  }
  return items;
};

export const createItem = async (item) => {
  let itemRef = null;

  if (!item.name) {
    throw new Error('품목명을 입력해주세요');
  }

  try {
    const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
    let newItem = { ...item, created_at: serverTimestamp };
    // available 기본값이 입력되지 않았으면 포함시켜준다.
    if (!newItem.available) {
      newItem.available = false;
    }
    itemRef = await firestore.collection('item').add(newItem);
  } catch (err) {
    console.error('Error create item: ', err);
    throw err;
  }
  return itemRef;
};

export const updateItem = async (item) => {
  const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
  const { id } = item;
  let newItem = { ...item, updated_at: serverTimestamp };
  // created_at 째로 update되면 created_at의 타입의 유형이 바뀌게 되는 문제가 있어
  // created_at를 delete하고 update한다.
  delete newItem.created_at;
  // id는 또 저장될 필요 없으므로 제거
  // delete newItem.id;
  try {
    console.log(newItem, id);
    const itemRef = await firestore.collection('item').doc(id);
    await itemRef.update(newItem);
  } catch (err) {
    console.error('Error update item: ', err);
    throw err;
  }
  return true;
};

export const deleteItem = async (id) => {
  try {
    await firestore.collection('item').doc(id).delete();
  } catch (err) {
    console.error('Error delete item: ', err);
    throw err;
  }
  return true;
};

/***** END Item *****/

/***** Order *****/
export const fetchOrderableItem = async () => {
  let items = [];
  try {
    const querySnapshot = await firestore
      .collection('item')
      .where('available', '==', true)
      // .where('quantity', '>', 0) /* 복합 색인 필요 */
      .orderBy('created_at', 'asc')
      .get();
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      item.id = doc.id;

      if (item.quantity > 0) {
        items.push(item);
      }
    });
    console.log('fetchOrderableItems');
  } catch (err) {
    console.error('Error fetch document: ', err);
    throw err;
  }
  return items;
};

// TODO: function으로 변경 후, 데이터 검증 후에 order가 생성되도록 변경
// export const createOrder = async (items, clientUser) => {
//   const order_number = generateOrderNumber();
//   const { ORDERED } = orderStatus;
//   try {
//     const total = items.map(({ price, orderQuantity }) => price * orderQuantity).reduce((sum, i) => sum + i, 0);
//     const subtotal = total * (1 - TAX_RATE);

//     const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
//     await firestore
//       .collection('order')
//       .doc(order_number)
//       .set({
//         ...clientUser,
//         order_number: order_number,
//         items: items,
//         total: total,
//         subtotal: subtotal,
//         tax_rate: TAX_RATE,
//         tracking_number: null,
//         status: ORDERED,
//         created_at: serverTimestamp,
//       });
//   } catch (err) {
//     console.error('Error create order: ', err);
//     throw err;
//   }
//   return order_number;
// };

export const createOrder = async (items) => {
  const order_number = generateOrderNumber();
  const { ORDERED } = orderStatus;

  const total = items.map(({ price, orderQuantity }) => price * orderQuantity).reduce((sum, i) => sum + i, 0);
  const subtotal = total * (1 - TAX_RATE);

  const data = {
    order_number: order_number,
    items: items,
    total: total,
    subtotal: subtotal,
    tax_rate: TAX_RATE,
    tracking_number: null,
    status: ORDERED,
  };

  const createOrderFunctions = functions.httpsCallable('createOrder');

  try {
    const response = await createOrderFunctions(data);
    console.log(response);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return order_number;
};

/***** END Order *****/

/***** Order Status *****/

export const fetchOrders = async (limitCount = 0) => {
  let orders = [];
  try {
    const queryRef = await firestore.collection('order').orderBy('created_at', 'desc');
    const querySnapshot = limitCount > 0 ? await queryRef.limit(limitCount).get() : await queryRef.get();
    querySnapshot.forEach((doc) => {
      const order = doc.data();
      order.id = doc.id;
      orders.push(order);
    });
  } catch (err) {
    console.error('Error fetchOrders: ', err);
    throw err;
  }
  return orders;
};

export const fetchOrdersListener = async (limitCount = 0) => {
  let orderData = [];

  try {
    const queryRef = await firestore.collection('order').orderBy('created_at', 'desc');
    const queryOnSnapshot = limitCount > 0 ? await queryRef.limit(limitCount).onSnapshot : await queryRef.onSnapshot;
    const unsubscribe = queryOnSnapshot(
      (snapshot) => {
        orderData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      },
      (err) => {
        throw err;
      },
    );

    return { orderData, unsubscribe };
  } catch (err) {
    console.error('Error fetchOrdersListener: ', err);
    throw err;
  }
};

export const fetchOrder = async (orderNumber) => {
  try {
    const orderRef = await firestore.collection('order').doc(orderNumber);
    const orderSnapshot = await orderRef.get();
    const orderData = orderSnapshot.data();
    return orderData;
  } catch (err) {
    console.error('Error fetchOrder: ', err);
    throw err;
  }
};

export const cancelOrder = async (cancelReason, orderNumber) => {
  const { SENT, COMPLETED, CANCELED } = orderStatus;

  try {
    const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
    const isAdmin = !!idTokenResult.claims.admin;

    const orderRef = await firestore.collection('order').doc(orderNumber);
    const orderSnapshot = await orderRef.get();
    const orderData = orderSnapshot.data();
    const { status } = orderData;

    if ((status === SENT || status === COMPLETED) && !isAdmin) {
      throw new Error('이미 발송되었기 때문에 취소할 수 없습니다.');
    }

    await orderRef.update({
      status: CANCELED,
      cancel_reason: cancelReason,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error('Error cancelOrder: ', err);
    throw err;
  }
  return true;
};

export const updateTrackingNumber = async (trackingNumber, orderNumber) => {
  const { SENT, COMPLETED, CANCELED } = orderStatus;

  try {
    const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
    const isAdmin = !!idTokenResult.claims.admin;
    const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

    const orderRef = await firestore.collection('order').doc(orderNumber);
    const orderSnapshot = await orderRef.get();
    const orderData = orderSnapshot.data();
    const { status } = orderData;

    if (!isAdmin) {
      throw new Error('비정상적인 접근입니다.');
    }

    if (status === COMPLETED || status === CANCELED) {
      throw new Error('발주 상태가 취소되었거나 완료된 경우 발송됨 처리를 할 수 없습니다');
    }
    await orderRef.update({
      status: SENT,
      tracking_number: trackingNumber,
      shipping_started_at: serverTimestamp,
      updated_at: serverTimestamp,
    });
  } catch (err) {
    console.error('Error updateTrackingNumber: ', err);
    throw err;
  }
  return true;
};

export const updateConfirmCompleted = async (orderNumber) => {
  const { SENT, COMPLETED } = orderStatus;

  try {
    const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

    const orderRef = await firestore.collection('order').doc(orderNumber);
    const orderSnapshot = await orderRef.get();
    const orderData = orderSnapshot.data();
    const { status } = orderData;

    if (status === COMPLETED) {
      throw new Error('이미 완료된 주문입니다');
    } else if (status !== SENT) {
      throw new Error('발송된 주문에 한해서만 수취 확인이 가능합니다.');
    }

    await orderRef.update({
      status: COMPLETED,
      updated_at: serverTimestamp,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/***** END Order Status *****/

/***** Settings *****/

export const updateProfile = async (profile) => {
  const { displayName } = profile;
  const user = firebase.auth().currentUser;

  try {
    await user.updateProfile({
      displayName,
    });
    return true;
  } catch (err) {
    throw err;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  const user = firebase.auth().currentUser;
  const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

  try {
    await user.reauthenticateWithCredential(credential);
    await user.updatePassword(newPassword);
    return true;
  } catch (err) {
    throw err;
  }
};

/***** END Settings *****/
