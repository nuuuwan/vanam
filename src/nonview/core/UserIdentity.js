import { v4 as uuidv4 } from "uuid";

export default class UserIdentity {
  static STORAGE_KEY = "vanam_user_id";
  static instance = null;

  constructor(userId) {
    this.userId = userId;
  }

  static getInstance() {
    if (!UserIdentity.instance) {
      let userId = localStorage.getItem(UserIdentity.STORAGE_KEY);

      if (!userId) {
        userId = uuidv4();
        localStorage.setItem(UserIdentity.STORAGE_KEY, userId);
        console.log("Generated new user ID:", userId);
      } else {
        console.log("Loaded existing user ID:", userId);
      }

      UserIdentity.instance = new UserIdentity(userId);
    }

    return UserIdentity.instance;
  }

  getUserId() {
    return this.userId;
  }

  static reset() {
    localStorage.removeItem(UserIdentity.STORAGE_KEY);
    UserIdentity.instance = null;
    return UserIdentity.getInstance().getUserId();
  }
}
