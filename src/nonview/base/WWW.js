export default class WWW {
  static async fetchJSON(url) {
    console.debug("Fetching JSON from URL:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
}
