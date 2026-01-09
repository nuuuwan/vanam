import { v4 as uuidv4 } from "uuid";

/**
 * UserIdentity manages anonymous user identification with device persistence.
 *
 * Generates a UUID on first app launch, stores it in localStorage,
 * and provides it for upload attribution.
 *
 * Features:
 * - Stable identity per device
 * - Zero UI
 * - No PII
 * - No auth flows
 *
 * Limitations:
 * - No identity across devices
 * - No proof of personhood
 * - No protection against spoofing
 */
export default class UserIdentity {
  static STORAGE_KEY = "vanam_user_id";
  static instance = null;

  constructor(userId) {
    this.userId = userId;
  }

  /**
   * Gets or creates the user ID
   * @returns {UserIdentity} The UserIdentity instance
   */
  static getInstance() {
    if (!UserIdentity.instance) {
      let userId = localStorage.getItem(UserIdentity.STORAGE_KEY);

      if (!userId) {
        // Generate new UUID on first launch
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

  /**
   * Gets the user ID string
   * @returns {string} The user ID
   */
  getUserId() {
    return this.userId;
  }

  /**
   * For testing/debugging: resets the user ID and generates a new one
   * @returns {string} The new user ID
   */
  static reset() {
    localStorage.removeItem(UserIdentity.STORAGE_KEY);
    UserIdentity.instance = null;
    return UserIdentity.getInstance().getUserId();
  }
}
