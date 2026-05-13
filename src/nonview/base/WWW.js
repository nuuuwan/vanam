export default class WWW {
  static async fetchJSON(url) {
    const bustUrl = url + (url.includes("?") ? "&" : "?") + "t=" + Date.now();
    console.debug("Fetching JSON from URL:", bustUrl);
    const response = await fetch(bustUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
}
