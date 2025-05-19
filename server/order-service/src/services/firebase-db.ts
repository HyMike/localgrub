// import { getFirestore } from 'firebase-admin/firestore';



// export const userDoc = async (uid: string) => {
//     const userDoc = await db.collection('users').doc(uid).get();
//     if (!userDoc.exists) {
//         return { message: 'User data not found' };
//     }
//     return userDoc;

// }

// import admin from 'firebase-admin';

// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.applicationDefault()
//     });
// }
// const db = getFirestore();

// export default db;