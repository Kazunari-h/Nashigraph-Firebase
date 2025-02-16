// firebaseの設定を読み込む

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";

// adminが初期化済みでない場合のみ初期化
if (!admin.apps.length) {
  admin.initializeApp();
}

export { admin, functions, logger };
