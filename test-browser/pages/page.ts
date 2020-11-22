/* eslint-disable class-methods-use-this */
export default class Page {
  open(): void {
    return browser.url(`http://localhost:1337`);
  }
}
