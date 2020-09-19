import Homepage from '../pageobjects/home.page';

describe('The homepage', () => {
  it('should display a heading', () => {
    Homepage.open();

    expect(Homepage.isHeadingDisplayed()).toBe(true);
  });
});
