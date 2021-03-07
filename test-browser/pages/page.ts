/* eslint-disable class-methods-use-this */
declare let wdioBaseUrl: string;

export default class Page {
  open(path?: string): void {
    if (path && path[0] !== '/') {
      throw new Error(
        `path argument, if supplied, must start with a forward slash (/). path argument supplied was: ${path}`,
      );
    }
    const url = `${wdioBaseUrl}${path || ''}`;
    console.log(`Opening URL ${url}`);
    browser.url(url);
  }
}
