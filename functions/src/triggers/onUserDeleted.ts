import type { UserRecord } from "firebase-admin/auth";
import type { FirebaseError } from "firebase-admin";

import { admin, functions } from "../utils/firebase";

import { USERS_COLLECTION_PREFIX } from "../config";

// adminが初期化済みでない場合のみ初期化
if (!admin.apps.length) admin.initializeApp();

// Authの削除トリガー（削除対象ユーザーのFirestoreデータを削除する例）
exports.onUserDeleted = functions.auth.user().onDelete((user: UserRecord) => {
  const uid = user.uid;
  // Firestore上のユーザーデータの削除 (例: "users" コレクション)
  return admin
    .firestore()
    .collection(USERS_COLLECTION_PREFIX)
    .doc(uid)
    .delete()
    .then(() => {
      console.log(`User data for uid ${uid} has been deleted from Firestore.`);
      return null;
    })
    .catch((error: FirebaseError) => {
      console.error(`Failed to delete user data for uid ${uid}:`, error);
      throw error;
    });
});
