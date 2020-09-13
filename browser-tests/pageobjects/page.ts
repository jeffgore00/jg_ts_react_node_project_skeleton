/* eslint-disable class-methods-use-this */
export default class Page {
  open() : void {
    return browser.url(`http://192.168.1.221:3000`);
  }
}
