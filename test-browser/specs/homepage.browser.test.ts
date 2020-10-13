import Homepage from '../pages/home.page';

describe('The homepage', () => {
  it('should display a heading', () => {
    Homepage.open();

    expect(Homepage.isHeadingDisplayed()).toBe(true);

    // Simulate mobile window (Pixel 2)
    browser.setWindowSize(411, 731);

    expect(Homepage.isHeadingDisplayed()).toBe(true);
  });
});
