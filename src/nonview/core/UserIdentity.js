import { v4 as uuidv4 } from "uuid";

export default class UserIdentity {
  static STORAGE_KEY = "vanam_user_id";
  static USER_ID_LENGTH = 8;
  static instance = null;

  constructor(userId) {
    this.userId = userId;
  }

  static getInstanceHot() {
    const userId = uuidv4().substring(0, UserIdentity.USER_ID_LENGTH);
    return new UserIdentity(userId);
  }

  static getInstance() {
    return Cache.get("vanam-user-identity", () =>
      UserIdentity.getInstanceHot()
    );
  }

  static getUserId() {
    return this.userId;
  }
}
