import { html, fixture, expect } from '@open-wc/testing';

import '../dist/lib/search-box.es5.min.js';

let searchBox;

beforeEach(async () => {
  searchBox = await fixture(html`
      <search-box></search-box>
    `);
});


describe('search-box', () => {
  it('Should show initially an empty input element', async () => {
    const input = searchBox.shadowRoot.querySelector('input');

    expect(input).not.to.equal(null);
    expect(input.value).equal("");
  });

  it('Should send en event when an input value is entered', async () => {
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

  it('Should display french labels when lang attribute is fr', async () => {
    searchBox = await fixture(html`
      <search-box lang="fr"></search-box>
    `);
    const input = searchBox.shadowRoot.querySelector('input');
    expect(input.placeholder).equal("🔍Filtrer les requêtes");
  });

});
