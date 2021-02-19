/* eslint-disable class-methods-use-this */
import Page from './page';

class Homepage extends Page {
  get heading(): WebdriverIO.Element {
    return $('h1');
  }

  isHeadingDisplayed(): boolean {
    return this.heading.waitForDisplayed();
  }

  open(): void {
    return super.open();
  }
}

export default new Homepage();
