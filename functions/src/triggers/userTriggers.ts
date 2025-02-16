import type { FirebaseError } from "firebase-admin";

import { admin, functions, logger } from "../utils/firebase";
import { VERSION_DOCUMENT_PREFIX } from "../config";

// user & userIds のコレクションに対するトリガーを設定

// userIdsのuserIdが作成と変更されたとき、中に書いてあるuserDocumentIdのユーザーのuserIdを更新する
exports.onUserIdCreated = functions.firestore
  .document(`${VERSION_DOCUMENT_PREFIX}/userIds/{userId}`)
  .onCreate((snapshot, context) => {
    const userId = context.params.userId;

    const userDocumentId = snapshot.data().userDocumentId;
    return admin
      .firestore()
      .collection(`${VERSION_DOCUMENT_PREFIX}/users`)
      .doc(userDocumentId)
      .update({ userId: userId })
      .then(() => {
        logger.info(`Updated userId for user ${userDocumentId}`);
        return null;
      })
      .catch((error: FirebaseError) => {
        logger.error(
          `Failed to update userId for user ${userDocumentId}:`,
          error,
        );
        throw error;
      });
  });
