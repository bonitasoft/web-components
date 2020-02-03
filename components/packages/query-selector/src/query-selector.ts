import {css, customElement, html, LitElement, property} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';
import '@bonitasoft/search-box';
import '@bonitasoft/pagination-selector';
// @ts-ignore
import bootstrapStyles from './style.scss';
import {get, listenForLangChanged, registerTranslateConfig, translate, use} from "lit-translate";
import * as i18n_en from "./i18n/en.json";
import * as i18n_es from "./i18n/es-ES.json";
import * as i18n_fr from "./i18n/fr.json";
import * as i18n_ja from "./i18n/ja.json";
import * as i18n_pt from "./i18n/pt-BR.json";

// Registers i18n loader
registerTranslateConfig({
    loader: (lang) => Promise.resolve(QuerySelector.getCatalog(lang))
});

@customElement('query-selector')
export class QuerySelector extends LitElement {

    @property({attribute: 'lang', type: String, reflect: true})
    lang: string = "en";

    @property({
        attribute: 'queries', type: Object, reflect: true, hasChanged(value: any): boolean {
            if (!value.hasOwnProperty('defaultQuery')) {
                value.defaultQuery = [];
            }
            if (!value.hasOwnProperty('additionalQuery')) {
                value.additionalQuery = [];
            }
            return true;
        }
    })
    private queries: any = {"defaultQuery": [], "additionalQuery": []};

    @property({
        attribute: 'init', type: Object, reflect: true
    })
    private init: any;

    @property({
        type: String
    })
    private selectedQuery = '';

    @property({type: Array})
    private filterArgs = [];

    @property({type: String})
    private queryFilter = '';

    private filterTitlePrefix: string = "";
    private filterTitle: string = "";


    constructor() {
        super();
        listenForLangChanged(() => {
            this.filterTitlePrefix = get("filterTitlePrefix");
            this.filterTitle = this.filterTitlePrefix;
        });
    }

    attributeChangedCallback(name: string, old: string | null, value: string | null): void {
        if (name === 'init') {
            let valueInit = JSON.parse(value!);
            if (valueInit.query) {
                this.filterTitle = this.filterTitlePrefix + ' ' + valueInit.query.name;
                this.selectedQuery = valueInit.query.name;
                this.filterArgs = valueInit.filters;
            }
        }
        super.attributeChangedCallback(name, old, value);
    }

    async connectedCallback() {
        use(this.lang).then();
        super.connectedCallback();
    }

    static getCatalog(lang: string) {
        switch (lang) {
            case "es":
                return i18n_es;
            case "fr":
                return i18n_fr;
            case "ja":
                return i18n_ja;
            case "pt":
                return i18n_pt;
            default:
                return i18n_en;
        }
    }

    static get styles() {
        return css`
      :host {
        display: block;
        font-family: sans-serif;
        font-size: 14px;
        text-align: left;
      }

      .filter-container {
        display: flex;
        flex-wrap: wrap;
      }

      .filter-item {
        padding: 5px;
        // flex-basis: 18em;
        flex-grow: 1;
        max-width: 50%;
      }

      .list-group-item.active {
        background-color: grey;
        border-color: lightgrey;
      }

      .scroll {
        max-height: 15em;
        overflow-y: auto;
      }

      .filter-input {
        font-size: 14px;
      }

      .filter-item.required .control-label:after {
        content: '*';
        color: red;
      }

      .tip {
        padding-left: 10px;
      }

      .guide {
        color: grey;
        text-align: center;
        font-style: italic;
      }
      search-box {
        --max-width: 100%;
      }
      .card-deck {
        margin-bottom: 15px;
      }
    `;
    }

    render() {
        return html`
      <style>${bootstrapStyles}</style>
      <div class="guide">
        ${translate("help")}
      </div>
      <!-- Query card -->
      <search-box
        lang="${this.lang}"
        id="searchbox"
        @valueChange=${(e: any) => {
            this.queryFilterChanged(e.detail);
        }}
      ></search-box>
      <div class="card-deck">
        <!-- Default Queries-->
        <div id="defaultQueries" class="card">
          <div class="card-header">
            <b>${translate("defaultQueriesTitle")}</b>
          </div>
          <ul class="list-group scroll" id="queries">
            ${this.queries.defaultQuery.map((query: any) => this.getDefaultQueries(query))}
          </ul>
        </div>

        <!-- Additional Queries-->
        <div id="additionalQueries" class="card">
          <div class="card-header">
            <b>${translate("additionalQueriesTitle")}</b>
          </div>
          <ul class="list-group scroll" id="queries">
            ${this.queries.additionalQuery.map((query: any) => this.getAdditionalQueries(query))}
          </ul>
        </div>
      </div>      

      <!-- Filter card -->
      ${this.filterArgs.length > 0
            ? html`
            <div id="filter" class="card">
              <div class="card-header">
                <b>${this.filterTitle} </b>
              </div>
              <div class="filter-container">
                ${this.filterArgs.map(
                (arg: any) => html`
                    <div class="filter-item required">
                      <label class="control-label" for="arg">${arg.name}</label>
                      <div class="input-group filter-input">
                        <input
                          type="text"
                          class="form-control filter-input"
                          id="arg"
                          value=${this.getFilterValue(this.selectedQuery, arg.name)}
                          placeholder="Type a ${arg.type}"
                          @input=${(e: any) => this.filterArgChanged(arg, e.target.value)}
                        />
                        <div class="input-group-append">
                          <span class="input-group-text filter-input">¶</span>
                        </div>
                      </div>
                    </div>
                  `,
            )}
              </div>
            </div>
          `
            : html``}

      <!-- Pagination -->
      <pagination-selector
        lang="${this.lang}"
        nb-elements="${this.getPaginationNbElements()}" 
        page-index="${this.getPaginationPageIndex()}"
      ></pagination-selector>
      <br />

      <!-- Tips-->
      <div class="tip">
      <p>💡 ${translate("tip1")}</p>
      <p>💡 ${translate("tip2")}</p>
      </div>
    `;
    }

    //
    // Private methods
    //
    private getDefaultQueries(query: any) {
        return html`
      ${this.isFiltered(query.displayName)
            ? html`
            <li
              class="list-group-item list-group-item-action ${classMap(this.isSelected(query.query) ? {active: true} : {})}"
              @click="${() => this.select(query, true)}"
            >
              ${query.displayName}
            </li>
          `
            : html``}
    `;
    }

    private getAdditionalQueries(query: any) {
        return html`
      ${this.isFiltered(query.displayName)
            ? html`
            <li
              class="list-group-item list-group-item-action 
                        ${classMap(this.isSelected(query.query) ? {active: true} : {})}"
              @click="${() => this.select(query, true)}"
            >
              ${query.query}
            </li>
          `
            : html``}
    `;
    }

    private isFiltered(query: string) {
        return query.toLowerCase().includes(this.queryFilter);
    }

    private queryFilterChanged(value: string) {
        this.queryFilter = value;
    }

    private filterArgChanged(arg: string, value: string) {
        Object.assign(arg, {value: value});
        let event: any = {"query": {"name": this.selectedQuery}};
        event.filters = this.filterArgs;
        this.dispatchEvent(
            new CustomEvent('filterChanged', {
                detail: event,
                bubbles: true,
                composed: true,
            }),
        );
    }

    private select(query: any, sendEvent: boolean) {
        this.filterTitle = this.filterTitlePrefix + ' ' + query.name;
        this.selectedQuery = query.query || query.name;
        this.filterArgs = query.filters;
        if (sendEvent) {
            this.dispatchEvent(
                new CustomEvent('querySelected', {
                    detail: this.selectedQuery,
                    bubbles: true,
                    composed: true,
                }),
            );
        }
    }

    private isSelected(queryName: string) {
        return queryName === this.selectedQuery;
    }

    private getFilterValue(queryName: string, filterName: string): string {
        let value = '';
        if (this.init && this.init.query && this.init.filters && queryName === this.init.query.name) {
            this.init.filters.forEach((filter: any) => {
                if (filter.name === filterName) {
                    value = filter.value;
                }
            });
        }
        return value;
    }

    private getPaginationNbElements(): number {
        if (this.init && this.init.pagination && (this.init.query && this.selectedQuery === this.init.query.name)) {
            return this.init.pagination.c;
        }
        return 10;
    }

    private getPaginationPageIndex(): number {
        if (this.init && this.init.pagination &&(this.init.query && this.selectedQuery === this.init.query.name)) {
            return this.init.pagination.p;
        }
        return 0;
    }
}
