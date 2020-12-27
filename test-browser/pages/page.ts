/* eslint-disable class-methods-use-this */
export default class Page {
  open(): void {
    // TODO: make this configurable
    // return browser.url(`http://localhost:1337`);
    return browser.url('https://ts-react-node-project-skeleton.herokuapp.com/');
  }
}
