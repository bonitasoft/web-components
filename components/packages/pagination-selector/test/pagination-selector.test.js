import {expect, fixture, html} from '@open-wc/testing';

import '../build/pagination-selector.js';

describe('pagination-selector', () => {

    it('Send an event when the pagination (nb elements or page number) is changed', async () => {
        let paginationSel = await getPaginationSelector();
        let elementValue = "";
        let pageNumberValue = "";
        paginationSel.addEventListener(
            'paginationElementsChanged',
            e => {
                elementValue = e.detail;
            }
        );
        paginationSel.addEventListener(
            'paginationPagesChanged',
            e => {
                pageNumberValue = e.detail;
            }
        );
        const inputs = paginationSel.shadowRoot.querySelectorAll('input');
        inputs[0].value = "20";
        // simulate input event
        inputs[0].dispatchEvent(new Event("input"));
        inputs[1].value = "1";
        inputs[1].dispatchEvent(new Event("input"));
        expect(elementValue).to.equal("20");
        expect(pageNumberValue).to.equal("1");
    });

    function getPaginationSelector() {
        return fixture(html`
      <pagination-selector></pagination-selector>
    `);
    }

});
