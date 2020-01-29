import {expect, fixture, html} from '@open-wc/testing';

import '../lib/query-selector.es5.min.js';

describe('query-selector', () => {
    let queries;
    let init;
    let querySel;


    before(() => {
        queries = '' +
            '{"defaultQuery":' +
            '[{"displayName":"name","query":"findByName","filters":[{"name":"name","type":"String"}]},' +
            '{"displayName":"address","query":"findByAddress","filters":[{"name":"address","type":"String"}]},' +
            '{"displayName":"phoneNumber","query":"findByPhoneNumber","filters":[{"name":"phoneNumber","type":"String"}]},' +
            '{"displayName":"persistenceId","query":"findByPersistenceId","filters":[{"name":"persistenceId","type":"Int"}]}],' +
            '"additionalQuery":' +
            '[{"displayName":"find","query":"find","filters":[]},' +
            '{"displayName":"findByNameAndPhoneNumber","query":"findByNameAndPhoneNumber","filters":[{"name":"name","type":"String"},{"name":"phoneNumber","type":"String"}]},' +
            '{"displayName":"findByAddressAndPhoneNumberAndName","query":"findByAddressAndPhoneNumberAndName","filters":[{"name":"address","type":"String"},{"name":"phoneNumber","type":"String"},{"name":"name","type":"String"}]},' +
            '{"displayName":"query1","query":"query1","filters":[{"name":"name","type":"String"},{"name":"address","type":"String"},{"name":"phoneNumber","type":"String"}]},' +
            '{"displayName":"query2","query":"query2","filters":[{"name":"name","type":"String"},{"name":"address","type":"String"}]},' +
            '{"displayName":"query3","query":"query3","filters":[]},' +
            '{"displayName":"query4","query":"query4","filters":[]},' +
            '{"displayName":"query5","query":"query5","filters":[]},' +
            '{"displayName":"query6","query":"query6","filters":[]}]}'
    });

    beforeEach(async () => {
        querySel = await getQuerySelector();
    });


    it('Should default queries card contains the right number of items', async () => {
        const queryLines = getQueries(querySel, '#defaultQueries');

        expect(queryLines.length).equal(4);
    });

    it('Should additional queries card contains the right number of items', async () => {
        const queryLines = getQueries(querySel, '#additionalQueries');

        expect(queryLines.length).equal(9);
    });

    it('Should queries are filtered when a search string is entered', async () => {
        const searchBox = querySel.shadowRoot.querySelector('#searchbox');
        const searchInput = searchBox.shadowRoot.querySelector('.search-input');

        searchInput.value = "address";
        // Value changed from js does not send the 'input' event: simulate it
        searchInput.dispatchEvent(new Event("input"));

        // setTimeout(0) will make sure we are the last in the event queue, so the click event has been handled by the web component
        let promise = new Promise((resolve) => {
            setTimeout(() => {
                // should display 1 default query and 1 additional query
                const defaultQueriesLines = getQueries(querySel, '#defaultQueries');
                expect(defaultQueriesLines.length).equal(1);
                const additionalQueriesLines = getQueries(querySel, '#additionalQueries');
                expect(additionalQueriesLines.length).equal(1);
                resolve();
            }, 0);
        });
        // wait for the promise is done
        await promise.then(() => {
        });
    });

    it('Should send en event when a query is selected', async () => {
        let eventReceived = false;
        let selectedQuery = "";
        querySel.addEventListener(
            'querySelected',
            e => {
                eventReceived = true;
                selectedQuery = e.detail;
            }
        );

        getFirstDefaultQuery(querySel).click();

        expect(eventReceived).to.equal(true);
        expect(selectedQuery).to.equal("findByName");
    });

    it('Should display the query arguments when the query is selected', async () => {
        // No selection: filter card should not be displayed
        let filterCard = getfilterCard(querySel);

        expect(filterCard).to.equal(null);

        getFirstDefaultQuery(querySel).click();

        let promise = new Promise((resolve) => {
            setTimeout(() => {
                // After selection, filter card should contain the right arguments
                filterCard = getfilterCard(querySel);
                expect(filterCard).not.to.equal(null);
                const argLabel = filterCard.querySelectorAll('label');
                expect(argLabel.length).to.equal(1);
                expect(argLabel[0].innerText).to.equal("name");
                resolve();
            }, 0);
        });
        // wait for the promise is done
        await promise.then(() => {
        });

    });

    it('Should send an event when a query argument value is changed', async () => {
        let eventReceived = false;
        let filterValue = "";
        querySel.addEventListener(
            'filterChanged',
            e => {
                eventReceived = true;
                filterValue = e.detail[0].value;
            }
        );

        getFirstDefaultQuery(querySel).click();
        let promise = new Promise((resolve) => {
            setTimeout(() => {
                let filterCard = getfilterCard(querySel);
                const argInput = filterCard.querySelectorAll('#arg');
                argInput[0].value = "myName";
                // Value changed from js does not send the 'input' event: simulate it
                argInput[0].dispatchEvent(new Event("input"));
                resolve();
            }, 0);
        });
        // wait for the promise is done
        await promise.then(() => {
        });

        expect(eventReceived).to.equal(true);
        expect(filterValue).to.equal("myName");
    });

    it('Should send an event when the pagination (nb elements or page number) is changed', async () => {
        let elementValue = "";
        let pageNumberValue = "";
        querySel.addEventListener(
            'paginationElementsChanged',
            e => {
                elementValue = e.detail;
            }
        );
        querySel.addEventListener(
            'paginationPagesChanged',
            e => {
                pageNumberValue = e.detail;
            }
        );
        const paginationSel = querySel.shadowRoot.querySelector('pagination-selector');
        const inputs = paginationSel.shadowRoot.querySelectorAll('input');

        inputs[0].value = "20";
        // simulate input event
        inputs[0].dispatchEvent(new Event("input"));
        inputs[1].value = "1";
        inputs[1].dispatchEvent(new Event("input"));

        expect(elementValue).to.equal("20");
        expect(pageNumberValue).to.equal("1");
    });

    it('Should component behave correctly when queries attribute is not provided', async () => {
        querySel = await fixture(html`<query-selector></query-selector>`);
        const queryLinesDefault = getQueries(querySel, '#defaultQueries');
        const queryLinesAdditional = getQueries(querySel, '#additionalQueries');

        expect(queryLinesDefault.length).equal(0);
        expect(queryLinesAdditional.length).equal(0);
    });

    it('Should display english labels by default', async () => {
        querySel = await fixture(html`<query-selector></query-selector>`);
        const additionalQueriesCard = querySel.shadowRoot.querySelector('#additionalQueries');
        expect(additionalQueriesCard.innerText).to.equal("Additional queries");
    });

    it('Should display french labels when lang attribute is fr', async () => {
        querySel = await fixture(html`<query-selector lang="fr"></query-selector>`);
        const additionalQueriesCard = querySel.shadowRoot.querySelector('#additionalQueries');
        expect(additionalQueriesCard.innerText).to.equal("Requêtes additionelles");
    });

    it('Should display the init parameters when the init attribute is used', async () => {
        init = '{"query": ' +
            '{"name":"findByNameAndPhoneNumber"},' +
            '"filters":[{"name":"name","type":"String","value":"myName"},{"name":"phoneNumber","type":"String","value":"myPhoneNumber"}],' +
            '"pagination": {"p":2,"c":20}}'

        querySel = await getQuerySelectorWithInit();

        // filter card should be displayed
        let filterCard = getfilterCard(querySel);
        expect(filterCard).not.to.equal(null);

        // filter card should contain the init arguments
        filterCard = getfilterCard(querySel);
        expect(filterCard).not.to.equal(null);
        let inputs = filterCard.querySelectorAll('input');
        expect(inputs.length).to.equal(2);
        expect(inputs[0].value).to.equal("myName");
        expect(inputs[1].value).to.equal("myPhoneNumber");

        // Pagination should contain th init parameters
        const paginationSel = querySel.shadowRoot.querySelector('pagination-selector');
        inputs = paginationSel.shadowRoot.querySelectorAll('input');
        expect(inputs[0].value).to.equal("20");
        expect(inputs[1].value).to.equal("2");

    });

    function getQuerySelector() {
        return fixture(html`
      <query-selector
        queries = ${queries}
      >
    </query-selector>
    `);
    }

    function getQuerySelectorWithInit() {
        return fixture(html`
      <query-selector
        queries = ${queries}
        init = ${init}
      >
    </query-selector>
    `);
    }

    function getQueries(querySelector, cardId) {
        const queriesCard = querySelector.shadowRoot.querySelector(cardId);
        expect(queriesCard).not.to.equal(null);
        return queriesCard.querySelectorAll('div ul li');
    }

    function getfilterCard(querySelector) {
        return querySelector.shadowRoot.querySelector('#filter');
    }

    function getFirstDefaultQuery(querySel) {
        return getQueries(querySel, '#defaultQueries')[0];
    }

});
