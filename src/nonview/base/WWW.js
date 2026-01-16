export default class WWW {
  static async fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async fetchTSV(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();

    const lines = text.replaceAll("\r", "").trim().split("\n");

    if (lines.length === 0) {
      return [];
    }
    const headers = lines[0].split("\t");
    return lines.slice(1).map((line) => {
      const values = line.split("\t");
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });
  }

  static async fetchPNG(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    return blob;
  }

  static async fetch(url) {
    if (url.endsWith(".json")) {
      return await this.fetchJSON(url);
    }
    if (url.endsWith(".tsv")) {
      return await this.fetchTSV(url);
    }
    if (url.endsWith(".png")) {
      return await this.fetchPNG(url);
    }
    throw new Error(`Unsupported file format for URL: ${url}`);
  }
}
