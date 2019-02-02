import { Given, Then, When } from 'cucumber';
import { expect } from 'chai';

Given(/^the user navigates to the test page/, () => {
  browser.url(`http://localhost:${process.env.TEST_PORT}`);
});

When(/^the application loads/, () => {
  browser.execute(() => {
    //@ts-ignore
    window.fetch = () => {
      //@ts-ignore
      return Promise.resolve({
        //@ts-ignore
        json: () => {
          //@ts-ignore
          return Promise.resolve([
            { id: '133', type: 0, name: 'This is text for the sake of testing. It matters not what it says.' }
          ]);
        }
      });
    }
  });
  browser.execute(() => {
    //@ts-ignore
    window.testroom.loadDelayedScripts();
  });
});

Then(/^all test items should be listed/, () => {
  browser.waitForExist('[data-type="result-item"]');
  expect(browser.elements('[data-type="result-item"]').value.length).to.equal(1);
});
