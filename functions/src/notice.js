const admin = require('firebase-admin');
const utils = require('./utils');
const onCall = utils.onCall;

const db = admin.firestore().collection('notice');

exports.createArticle = onCall((data, context) => {
  const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();
  const newItem = {
    ...data,
    created_at: serverTimestamp,
  };

  return db
    .add(newItem)
    .then(() => true)
    .catch((err) => {
      throw new functions.https.HttpsError('internal', err);
    });
});

exports.updateArticle = onCall((data, context) => {
  const { newItem, id } = data;
  const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();
  const article = {
    ...newItem,
    updated_at: serverTimestamp,
  };

  return db
    .doc(id)
    .update(article)
    .then(() => true)
    .catch((err) => {
      throw new functions.https.HttpsError('internal', err);
    });
});

exports.deleteArticle = onCall((data, context) => {
  const { id } = data;

  return db
    .doc(id)
    .delete()
    .then(() => true)
    .catch((err) => {
      throw new functions.https.HttpsError('internal', err);
    });
});
