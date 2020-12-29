const functions = require('firebase-functions');

const fn = functions.region('asia-northeast2');
exports.onCall = fn.https.onCall;
