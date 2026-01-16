import { v4 as uuidv4 } from "uuid";
import Cache from "../base/Cache";

export default class UserIdentity {
  static STORAGE_KEY = "vanam_user_id";
  static USER_ID_LENGTH = 8;

  constructor(userId) {
    this.userId = userId;
  }

  static getBrowserUserIdHot() {
    const userId = uuidv4().substring(0, UserIdentity.USER_ID_LENGTH);
    return userId;
  }

  static getBrowserUserId() {
    return Cache.get("vanam-user-identity", () =>
      UserIdentity.getInstanceHot()
    );
  }

  static getInstance() {
    return new UserIdentity(UserIdentity.getBrowserUserId());
  }

  getUserId() {
    return this.userId;
  }
}
