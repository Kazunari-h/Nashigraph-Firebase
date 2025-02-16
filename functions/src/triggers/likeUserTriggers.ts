import { admin, functions, logger } from "../utils/firebase";
import { USERS_COLLECTION_PREFIX } from "../config";
import type { FirebaseError } from "firebase-admin";

// もし、user/likePostにデータが追加されたとき、
// postIdを起点に投稿を取得し、likeCountをインクリメントする + post/likedUsersにuserIdを追加する

// user/likePostにデータが追加されたときにlikeUsersにデータを追加するトリガー
exports.onLikeUserCreated = functions.firestore
  .document(`${USERS_COLLECTION_PREFIX}/{userId}/likePost/{likePostId}`)
  .onCreate((snapshot, context) => {
    const postId = context.params.likePostId;

    // 投稿のlikeUsersコレクションにuserIdをidにして、createdAtを追加する
    return admin
      .firestore()
      .collection(`${USERS_COLLECTION_PREFIX}/${postId}/likedUsers`)
      .doc(context.params.userId)
      .set({
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        logger.info(`Added user ${context.params.userId} to likedUsers.`);
        return null;
      })
      .catch((error: FirebaseError) => {
        logger.error(
          `Failed to add user ${context.params.userId} to likedUsers:`,
          error,
        );
        throw error;
      });
  });

// もし、likeUsersにデータが追加されたとき、likeCountをインクリメントする
exports.onLikedUserCreated = functions.firestore
  .document(
    `${USERS_COLLECTION_PREFIX}/{userId}/posts/{postId}/likedUsers/{likeUserId}`,
  )
  .onCreate((snapshot, context) => {
    return admin
      .firestore()
      .collection(`${USERS_COLLECTION_PREFIX}/${context.params.userId}/posts`)
      .doc(context.params.postId)
      .update({
        likeCount: admin.firestore.FieldValue.increment(1),
      })
      .then(() => {
        logger.info(`Incremented likeCount for post ${context.params.postId}`);
        return null;
      })
      .catch((error: FirebaseError) => {
        logger.error(
          `Failed to increment likeCount for post ${context.params.postId}:`,
          error,
        );
        throw error;
      });
  });

exports.onLikeUserDeleted = functions.firestore
  .document(`${USERS_COLLECTION_PREFIX}/{userId}/likePost/{likePostId}`)
  .onDelete((snapshot, context) => {
    const postId = context.params.likePostId;

    // 投稿のlikeUsersコレクションからuserIdを削除する
    return admin
      .firestore()
      .collection(`${USERS_COLLECTION_PREFIX}/${postId}/likedUsers`)
      .doc(context.params.userId)
      .delete()
      .then(() => {
        logger.info(`Deleted user ${context.params.userId} from likedUsers.`);
        return null;
      })
      .catch((error: FirebaseError) => {
        logger.error(
          `Failed to delete user ${context.params.userId} from likedUsers:`,
          error,
        );
        throw error;
      });
  });

exports.onLikedUserDeleted = functions.firestore
  .document(
    `${USERS_COLLECTION_PREFIX}/{userId}/posts/{postId}/likedUsers/{likeUserId}`,
  )
  .onDelete((snapshot, context) => {
    return admin
      .firestore()
      .collection(`${USERS_COLLECTION_PREFIX}/${context.params.userId}/posts`)
      .doc(context.params.postId)
      .update({
        likeCount: admin.firestore.FieldValue.increment(-1),
      })
      .then(() => {
        logger.info(`Decremented likeCount for post ${context.params.postId}`);
        return null;
      })
      .catch((error: FirebaseError) => {
        logger.error(
          `Failed to decrement likeCount for post ${context.params.postId}:`,
          error,
        );
        throw error;
      });
  });
