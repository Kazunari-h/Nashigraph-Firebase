import type { UserRecord } from "firebase-admin/auth";
import type { FirebaseError } from "firebase-admin";

import { admin, functions, logger } from "../utils/firebase";
import { USERS_COLLECTION_PREFIX } from "../config";

if (!admin.apps.length) admin.initializeApp();

exports.onAuthUserCreated = functions.auth
  .user()
  .onCreate((user: UserRecord) => {
    const uid = user.uid;

    const userData = {
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      iconUrl: "https://placehold.jp/150x150.png",
      name: "Nashigraph初心者",
      isPublic: true,
      introduction: "",
    };
    return admin
      .firestore()
      .collection(USERS_COLLECTION_PREFIX)
      .doc(uid)
      .set(userData)
      .then(() => {
        logger.info(`User data for uid ${uid} has been created in Firestore.`);
        return null;
      })
      .catch((error: FirebaseError) => {
        logger.error(`Failed to create user data for uid ${uid}:`, error);
        throw error;
      });
  });

// Authの削除トリガー（削除対象ユーザーのFirestoreデータを削除する例）
exports.onAuthUserDeleted = functions.auth
  .user()
  .onDelete((user: UserRecord) => {
    const uid = user.uid;
    // Firestore上のユーザーデータの削除 (例: "users" コレクション)
    return admin
      .firestore()
      .collection(USERS_COLLECTION_PREFIX)
      .doc(uid)
      .delete()
      .then(() => {
        console.log(
          `User data for uid ${uid} has been deleted from Firestore.`,
        );
        return null;
      })
      .catch((error: FirebaseError) => {
        console.error(`Failed to delete user data for uid ${uid}:`, error);
        throw error;
      });
  });
