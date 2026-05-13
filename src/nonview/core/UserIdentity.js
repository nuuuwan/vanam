export default class UserIdentity {
  static STORAGE_KEY = "vanam-user-id";
  static USER_ID_LENGTH = 8;

  constructor(userId) {
    this.userId = userId;
  }

  static _fingerprintString() {
    const nav = window.navigator;
    const scr = window.screen;
    return [
      nav.userAgent,
      nav.language,
      nav.hardwareConcurrency,
      nav.platform,
      scr.width,
      scr.height,
      scr.colorDepth,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ].join("|");
  }

  static _hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h
      .toString(36)
      .padStart(7, "0")
      .substring(0, UserIdentity.USER_ID_LENGTH);
  }

  static getBrowserUserId() {
    const stored = localStorage.getItem(UserIdentity.STORAGE_KEY);
    if (stored) return stored;
    const id = UserIdentity._hash(UserIdentity._fingerprintString());
    localStorage.setItem(UserIdentity.STORAGE_KEY, id);
    return id;
  }

  static getInstance() {
    return new UserIdentity(UserIdentity.getBrowserUserId());
  }

  getUserId() {
    return this.userId;
  }
}
