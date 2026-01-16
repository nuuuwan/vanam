import { v4 as uuidv4 } from "uuid";
import Cache from "../base/Cache";

export default class UserIdentity {
  static CACHE_KEY = "vanam-user-identity";
  static USER_ID_LENGTH = 8;

  constructor(userId) {
    this.userId = userId;
  }

  static getBrowserUserIdHot() {
    const userId = uuidv4().substring(0, UserIdentity.USER_ID_LENGTH);
    return userId;
  }

  static getBrowserUserId() {
    return Cache.get(UserIdentity.CACHE_KEY, () =>
      UserIdentity.getBrowserUserIdHot()
    );
  }

  static getInstance() {
    return new UserIdentity(UserIdentity.getBrowserUserId());
  }

  getUserId() {
    return this.userId;
  }
}
