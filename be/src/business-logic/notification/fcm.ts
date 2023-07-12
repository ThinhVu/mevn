import admin from 'firebase-admin';

let serviceAccount, credential, app;

try {
   serviceAccount = { /*your firebase app*/ }
   // @ts-ignore
   credential = admin.credential.cert(serviceAccount)
   app = admin.initializeApp({credential})
} catch (e) {
   console.error('[notification] [fcm] failed to initialize')
}

export default app
