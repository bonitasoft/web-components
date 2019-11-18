import { html, fixture, expect } from '@open-wc/testing';

import '../build/search-box.js';

let searchBox;

beforeEach(async () => {
  searchBox = await fixture(html`
      <search-box></search-box>
    `);
});


describe('search-box', () => {
  it('Shows initially an empty input element', async () => {
    const input = searchBox.shadowRoot.querySelector('input');
    expect(input).not.to.equal(null);
    expect(input.value).equal("");
  });

  it('Send en event when an input value is entered', async () => {
    let eventReceived = false;
    let value = "";
    searchBox.addEventListener(
        'valueChange',
        e => {
          eventReceived = true;
          value = e.detail;
        }
    );

    const input = searchBox.shadowRoot.querySelector('input');
    input.value = "at";
    // Value changed from js does not send the 'input' event: simulate it
    input.dispatchEvent(new Event("input"));

    expect(eventReceived).to.equal(true);
    expect(value).to.equal("at");
  });

});
