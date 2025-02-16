import type { UserRecord } from "firebase-admin/auth";
import type { FirebaseError } from "firebase-admin";

import { admin, functions, logger } from "../utils/firebase";
import { USERS_COLLECTION_PREFIX } from "../config";

// 投稿が作られたとき、replySourceがある場合は、その投稿のreplyCountをインクリメントする
exports.onPostCreated = functions.firestore
  .document(`${USERS_COLLECTION_PREFIX}/{userId}/posts/{postId}`)
  .onCreate((snapshot, context) => {
    const postData = snapshot.data();

    // もし、replySource(reference)がある場合は、その投稿のreplyCountをインクリメントする
    if (postData.replySource) {
      const replySourceRef =
        postData.replySource as admin.firestore.DocumentReference;
      return replySourceRef
        .update({ replyCount: admin.firestore.FieldValue.increment(1) })
        .then(() => {
          logger.info(`Incremented replyCount for post ${replySourceRef.id}`);
          return null;
        })
        .catch((error: FirebaseError) => {
          logger.error(
            `Failed to increment replyCount for post ${replySourceRef.id}:`,
            error,
          );
          throw error;
        });
    } else {
      return null;
    }
  });

// 投稿が削除されたとき、replySourceがある場合は、その投稿のreplyCountをデクリメントする
exports.onPostDeleted = functions.firestore
  .document(`${USERS_COLLECTION_PREFIX}/{userId}/posts/{postId}`)
  .onDelete((snapshot, context) => {
    const postData = snapshot.data();

    // もし、replySource(reference)がある場合は、その投稿のreplyCountをデクリメントする
    if (postData.replySource) {
      const replySourceRef =
        postData.replySource as admin.firestore.DocumentReference;
      return replySourceRef
        .update({ replyCount: admin.firestore.FieldValue.increment(-1) })
        .then(() => {
          logger.info(`Decremented replyCount for post ${replySourceRef.id}`);
          return null;
        })
        .catch((error: FirebaseError) => {
          logger.error(
            `Failed to decrement replyCount for post ${replySourceRef.id}:`,
            error,
          );
          throw error;
        });
    } else {
      return;
    }
  });
