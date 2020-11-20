import { html, fixture, expect } from '@open-wc/testing';

import '../lib/pb-input.es5.min.js';

let pbInput;

beforeEach(async () => {
  pbInput = await fixture(html`
      <pb-input></pb-input>
    `);
});


describe('pb-input', () => {
  it('Should show initially an empty input element', async () => {
    const input = pbInput.shadowRoot.querySelector('input');

    expect(input).not.to.equal(null);
    expect(input.value).equal("");
  });

  it('Should set the id when attribute id is set', async () => {
    pbInput = await fixture(html`
      <pb-input id="MyPbInput"></pb-input>
    `);
    const rootDiv = pbInput.shadowRoot.querySelector('div');
    expect(rootDiv.id).equals("MyPbInput");
  });

  it('Should set the label when attribute label is set', async () => {
    pbInput = await fixture(html`
      <pb-input label="My label"></pb-input>
    `);
    const label = pbInput.shadowRoot.querySelector('label');
    expect(label.textContent).equals("My label");
  });

  it('Should hide the label when attribute label-hidden is set', async () => {
    pbInput = await fixture(html`
      <pb-input label-hidden></pb-input>
    `);
    const label = pbInput.shadowRoot.querySelector('label');
    expect(label).equals(null);
  });

  it('Should add a red star on label when attribute required is set', async () => {
    pbInput = await fixture(html`
      <pb-input required></pb-input>
    `);
    const label = pbInput.shadowRoot.querySelector('label');
    expect(label.classList.value).to.include("label-required");
  });

  it('Should set the css classes col-xxx and text-right the when attribute label-position/label-width are set', async () => {
    pbInput = await fixture(html`
      <pb-input label-position="left" label-width="5"></pb-input>
    `);
    let label = pbInput.shadowRoot.querySelector('label');
    // If position left, take the label-width
    expect(label.classList.value).to.include("col-5");
    expect(label.classList.value).to.include("text-right");
    let input = pbInput.shadowRoot.querySelector('input');
    expect(input.classList.value).to.include("col");

    pbInput = await fixture(html`
      <pb-input label-position="top" label-width="5"></pb-input>
    `);
    label = pbInput.shadowRoot.querySelector('label');
    // If position is not left, take 12
    expect(label.classList.value).to.include("col-12");
    expect(label.classList.value).not.to.include("text-right");
    input = pbInput.shadowRoot.querySelector('input');
    expect(input.classList.value).to.include("col");
  });

  it('Should set the placeholder when attribute placeholder is set', async () => {
    pbInput = await fixture(html`
      <pb-input placeholder="Enter a string"></pb-input>
    `);
    const input = pbInput.shadowRoot.querySelector('input');
    expect(input.placeholder).equals("Enter a string");
  });

  it('Should set the value when attribute value is set', async () => {
    pbInput = await fixture(html`
      <pb-input value="10"></pb-input>
    `);
    const input = pbInput.shadowRoot.querySelector('input');
    expect(input.value).equals("10");
  });

  it('Should set the type when attribute type is set', async () => {
    pbInput = await fixture(html`
      <pb-input type="checkbox"></pb-input>
    `);
    const input = pbInput.shadowRoot.querySelector('input');
    expect(input.type).equals("checkbox");
  });

  it('Should set the min/max/step when attributes min/max/step are set', async () => {
    pbInput = await fixture(html`
      <pb-input min="10" max="100" step="2"></pb-input>
    `);
    const input = pbInput.shadowRoot.querySelector('input');
    expect(input.min).equals("10");
    expect(input.max).equals("100");
    expect(input.step).equals("2");
  });

  it('Should set the minlength/maxlength when attributes min-length/max-length are set', async () => {
    pbInput = await fixture(html`
      <pb-input min-length="3" max-length="10"></pb-input>
    `);
    const input = pbInput.shadowRoot.querySelector('input');
    expect(input.minLength).equals(3);
    expect(input.maxLength).equals(10);
  });

  it('Should input be readonly when attribute readonly is set', async () => {
    pbInput = await fixture(html`
      <pb-input readonly></pb-input>
    `);
    const input = pbInput.shadowRoot.querySelector('input');
    expect(input.readOnly).equals(true);
  });

  it('Should send en event when an input value is entered', async () => {
    let eventReceived = false;
    let value = "";
    pbInput.addEventListener(
        'valueChange',
        e => {
          eventReceived = true;
          value = e.detail;
        }
    );
    const input = pbInput.shadowRoot.querySelector('input');

    input.value = "at";
    // Value changed from js does not send the 'input' event: simulate it
    input.dispatchEvent(new Event("input"));

    expect(eventReceived).to.equal(true);
    expect(value).to.equal("at");
  });

  it('Should display french labels when lang attribute is fr', async () => {
    pbInput = await fixture(html`
      <pb-input lang="fr"></pb-input>
    `);
    const label = pbInput.shadowRoot.querySelector('label');
    expect(label.textContent).equal("Label par défaut");
  });

});
