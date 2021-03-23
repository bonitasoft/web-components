import {expect, fixture, html} from '@open-wc/testing';

import '../lib/pagination-selector.es5.min.js';

describe('pagination-selector', () => {

    it('Should send an event when the pagination (nb elements or page number) is changed', async () => {
        let paginationSel = await getPaginationSelector();
        let elementValue = "";
        let pageNumberValue = "";
        paginationSel.addEventListener(
            'paginationChanged',
            e => {
                elementValue = e.detail.nbElements;
                pageNumberValue = e.detail.pageIndex;
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

    it('Should display french labels when lang attribute is fr', async () => {
        let paginationSel = await fixture(html`
      <pagination-selector lang="fr"></pagination-selector>
    `);
        const labels = paginationSel.shadowRoot.querySelectorAll('label');
        expect(labels.length).to.equal(2);
        expect(labels[1].innerText).to.equal("Index de la page (p)");
    });

    function getPaginationSelector() {
        return fixture(html`
      <pagination-selector></pagination-selector>
    `);
    }

});
