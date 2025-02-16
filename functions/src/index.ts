/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Authentificationのトリガー関数をインポート

import * as onAuthUserTriggers from "./triggers/authUserTriggers";
import * as onLikeUserTriggers from "./triggers/likeUserTriggers";
import * as onPostTriggers from "./triggers/postTriggers";
import * as onUserTriggers from "./triggers/userTriggers";

export {
  onAuthUserTriggers,
  onLikeUserTriggers,
  onPostTriggers,
  onUserTriggers,
};
