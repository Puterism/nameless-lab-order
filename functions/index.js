const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebaseAccountCredentials = require('./nameless-lab-order-firebase-adminsdk-7grwf-6583c974a8.json');

admin.initializeApp({
  credential: admin.credential.cert(firebaseAccountCredentials),
  databaseURL: 'https://nameless-lab-order.firebaseio.com',
  storageBucket: 'nameless-lab-order.appspot.com',
});

exports.createOrder = functions
  .region('asia-northeast2')
  .https.onCall(async (data, context) => {
    const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();
    const {
      order_number,
      items,
      total,
      subtotal,
      tax_rate,
      tracking_number,
      status,
    } = data;
    const { token, uid } = context.auth;
    const { name, email } = token;
    const clientUser = {
      client_name: name,
      client_account_email: email,
      client_account_uid: uid,
    };

    // TODO: items의 quantity 체크 w/ transaction
    // https://firebase.google.com/docs/firestore/manage-data/transactions?hl=ko
    // https://stackoverflow.com/questions/57653308/firestore-transaction-update-multiple-collections-in-a-single-transaction
    // https://thecloudfunction.com/blog/atomic-operations-with-firebase/
    // need
    // return admin
    //   .firestore()
    //   .runTransaction((transaction) => {
    //     items.forEach((item) => {
    //       const { orderQuantity } = item;
    //       const quantityDecrement = admin.firestore.FieldValue.increment(-orderQuantity);
    //       const itemRef = admin.firestore().collection('item').doc(item.id);
    //       const itemDoc = transaction.get(itemRef);
    //       // TODO: itemDoc.data is not a function
    //       const itemData = itemDoc.data();
    //       const { quantity } = itemData;
    //       if (quantity >= orderQuantity) {
    //         transaction.update(itemRef, {
    //           quantity: quantityDecrement,
    //         });
    //       }
    //     });

    //   })
    return admin
      .firestore()
      .collection('order')
      .doc(order_number)
      .set({
        ...clientUser,
        order_number: order_number,
        items: items,
        total: total,
        subtotal: subtotal,
        tax_rate: tax_rate,
        tracking_number: tracking_number,
        status: status,
        created_at: serverTimestamp,
      })
      .then(() => {
        return order_number;
      })
      .catch((err) => {
        console.error('Error create order: ', err);
        throw new functions.https.HttpsError('internal', err);
      });
  });

// exports.onCreateOrder = functions.firestore.document('order/{id}').onCreate((snap, context) => {
//   let newOrder = snap.data();
//   let total = 0;
//   const { items } = newOrder;
//   const batch = firestore.batch();

//   items.forEach((item) => {
//     const { id, price, quantity, orderQuantity } = item;
//     const itemRef = firestore.collection('item').doc(id);
//     const quantityDecrement = admin.firestore.FieldValue.increment(-orderQuantity);
//     total += price * orderQuantity;

//     if (quantity < orderQuantity) {
//       console.error('quantity < orderQuantity', quantity < orderQuantity);
//       throw new Error('Quantity is less than ordered quantity');
//     }

//     batch.update(itemRef, {
//       // quantity: quantity - orderQuantity,
//       quantity: quantityDecrement,
//     });
//     // itemRef
//     //   .update({
//     //     quantity: quantity - orderQuantity,
//     //   })
//     //   .then((response) => {
//     //     console.log('Document successfully updated!', response);
//     //     return true;
//     //   })
//     //   .catch((err) => {
//     //     // The document probably doesn't exist.
//     //     console.error('Error updating document: ', err);
//     //     throw err;
//     //   });
//   });

//   return batch
//     .commit()
//     .then(() => {
//       console.log('Batch successfully updated!');
//       return true;
//     })
//     .catch((err) => {
//       console.error('Error batch updating document: ', err);
//       throw err;
//     });
// });

exports.createAccount = functions
  .region('asia-northeast2')
  .https.onCall((data) => {
    return admin
      .auth()
      .createUser(data)
      .catch((error) => {
        throw new functions.https.HttpsError('internal', error.message);
      });
  });

exports.onCreateAccount = functions
  .region('asia-northeast2')
  .auth.user()
  .onCreate((user, context) => {
    const customClaims = {
      admin: false,
      accessLevel: 1,
    };

    const { email, displayName } = user;

    return admin
      .auth()
      .setCustomUserClaims(user.uid, customClaims)
      .then(() => {
        const metadataRef = admin.database().ref('account/' + user.uid);
        return metadataRef.set({
          email,
          displayName,
          updatedAt: new Date().getTime(),
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.setAdmin = functions
  .region('asia-northeast2')
  .https.onCall((email, context) => {
    if (context.auth.token.admin !== true) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Request not authorized. User must be a admin to fulfill request.',
      );
    }

    return grantAdminRole(email)
      .then(() => {
        return {
          result: `Request fulfilled! ${email} is now a admin.`,
        };
      })
      .catch((err) => {
        throw new functions.https.HttpsError('unknown', err);
      });
  });

exports.unsetAdmin = functions
  .region('asia-northeast2')
  .https.onCall((email, context) => {
    if (context.auth.token.admin !== true) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Request not authorized. User must be a admin to fulfill request.',
      );
    }

    return grantUserRole(email)
      .then(() => {
        return {
          result: `Request fulfilled! ${email} is now a admin.`,
        };
      })
      .catch((err) => {
        throw new functions.https.HttpsError('unknown', err);
      });
  });

async function grantAdminRole(email) {
  const user = await admin.auth().getUserByEmail(email);
  if (user.customClaims && user.customClaims.admin === true) {
    throw new Error('이 계정은 이미 관리자입니다');
  }
  return admin.auth().setCustomUserClaims(user.uid, {
    admin: true,
  });
}

async function grantUserRole(email) {
  const user = await admin.auth().getUserByEmail(email);
  if (user.customClaims && user.customClaims.admin === false) {
    throw new Error('이 계정은 이미 관리자가 아닙니다');
  }
  return admin.auth().setCustomUserClaims(user.uid, {
    admin: false,
  });
}

exports.disableUser = functions
  .region('asia-northeast2')
  .https.onCall((email, context) => {
    if (context.auth.token.admin !== true) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Request not authorized. User must be a admin to fulfill request.',
      );
    }
    return disableUserPromise(email)
      .then(() => {
        return {
          result: `Request fulfilled! ${email} is disabled now.`,
        };
      })
      .catch((err) => {
        throw new functions.https.HttpsError('unknown', err);
      });
  });

exports.enableUser = functions
  .region('asia-northeast2')
  .https.onCall((email, context) => {
    if (context.auth.token.admin !== true) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Request not authorized. User must be a admin to fulfill request.',
      );
    }

    return enableUserPromise(email)
      .then(() => {
        return {
          result: `Request fulfilled! ${email} is enabled now.`,
        };
      })
      .catch((err) => {
        throw new functions.https.HttpsError('unknown', err);
      });
  });

async function disableUserPromise(email) {
  const user = await admin.auth().getUserByEmail(email);
  if (user.disabled) {
    throw new Error('이 계정은 이미 비활성화되어 있습니다');
  }
  return admin.auth().updateUser(user.uid, {
    disabled: true,
  });
}

async function enableUserPromise(email) {
  const user = await admin.auth().getUserByEmail(email);
  if (!user.disabled) {
    throw new Error('이 계정은 이미 활성화되어 있습니다');
  }
  return admin.auth().updateUser(user.uid, {
    disabled: false,
  });
}

exports.createNotice = functions
  .region('asia-northeast2')
  .https.onCall((title, data, context) => {
    // TODO:
  });
