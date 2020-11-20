import { html, fixture, expect } from '@open-wc/testing';

import '../lib/pb-text.es5.min.js';

let pbText;

beforeEach(async () => {
  pbText = await fixture(html`
      <pb-text></pb-text>
    `);
});


describe('pb-text', () => {
  it('Should show an empty text element', async () => {
    const paragraph = pbText.shadowRoot.querySelector('p');

    expect(paragraph).not.to.equal(null);
    expect(removeComment(paragraph.innerHTML)).equal("");
  });

  it('Should set the label when attribute label is set', async () => {
    pbText = await fixture(html`
      <pb-text label="My label"></pb-text>
    `);
    const label = pbText.shadowRoot.querySelector('label');
    expect(label.textContent).equals("My label");
  });


  it('Should hide the label when attribute label-hidden is set', async () => {
    pbText = await fixture(html`
      <pb-text label-hidden></pb-text>
    `);
    const label = pbText.shadowRoot.querySelector('label');
    expect(label).equals(null);
  });

  it('Should set the css classes col-xxx and text-right when attribute label-position/label-width are set', async () => {
    pbText = await fixture(html`
      <pb-text label-position="left" label-width="5"></pb-text>
    `);
    let label = pbText.shadowRoot.querySelector('label');
    // If position left, take the label-width
    expect(label.classList.value).to.include("col-5");
    expect(label.classList.value).to.include("text-right");
    let paragraph = pbText.shadowRoot.querySelector('p');
    // If position left, take (12 - label-width)
    expect(paragraph.classList.value).to.include("col");

    pbText = await fixture(html`
      <pb-text label-position="top" label-width="5"></pb-text>
    `);
    label = pbText.shadowRoot.querySelector('label');
    // If position is not left, take 12
    expect(label.classList.value).to.include("col-12");
    expect(label.classList.value).not.to.include("text-right");
    paragraph = pbText.shadowRoot.querySelector('p');
    // If position is not left, take 12
    expect(paragraph.classList.value).to.include("col");
  });

  it('Should set the text when attribute text is set', async () => {
    pbText = await fixture(html`
      <pb-text text="10"></pb-text>
    `);
    const paragraph = pbText.shadowRoot.querySelector('p');
    expect(removeComment(paragraph.innerHTML)).equals("10");
  });


  it('Should set the css class text-<alignment> the when attribute alignment is set', async () => {
    pbText = await fixture(html`
      <pb-text label-hidden alignment="center"></pb-text>
    `);
    let paragraph = pbText.shadowRoot.querySelector('p');
    expect(paragraph.classList.value).to.include("text-center");
  });

  it('Should display label in correct language when lang attribute is set', async () => {
    pbText = await fixture(html`
      <pb-text></pb-text>
    `);
    let label = pbText.shadowRoot.querySelector('label');
    // Default is "en"
    expect(label.textContent).equal("Default label");

    pbText = await fixture(html`
      <pb-text lang="fr"></pb-text>
    `);
    label = pbText.shadowRoot.querySelector('label');
    expect(label.textContent).equal("Label par défaut");
  });

});

function removeComment(str) {
  return str.replace(/<\!--.*?-->/g, "");
}

