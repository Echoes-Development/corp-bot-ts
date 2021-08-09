import * as firebase from 'firebase-admin'

const { BOT_FIREBASE_CRED } = process.env

firebase.initializeApp({
  credential: firebase.credential.cert(BOT_FIREBASE_CRED || '')
})

export default firebase
