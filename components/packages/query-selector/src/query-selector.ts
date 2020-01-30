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

  @property({ attribute: 'lang', type: String, reflect: true })
  lang: string = "en";

  @property({ attribute: 'queries', type: Object, reflect: true })
  private queries: any = QuerySelector.getDefaultQueriesAttribute();

  @property({ attribute: 'init', type: Object, reflect: true})
  private init: any;

  @property({ type: String })
  private selectedQuery = '';

  @property({ type: Array })
  private filterArgs = [];

  @property({ type: String })
  private queryFilter = '';

  private filterTitlePrefix:string = "";
  private filterTitle: string = "";
  private defaultSelectedIndex: number | undefined = undefined;
  private additionalSelectedIndex: number | undefined = undefined;

    constructor() {
        super();
        listenForLangChanged(() => {
            this.filterTitlePrefix = get("filterTitlePrefix");
            this.filterTitle = this.filterTitlePrefix;
        });
    }

    async connectedCallback() {
        use(this.lang).then();
        super.connectedCallback();
        if (Object.entries(this.queries).length === 0) {
          this.queries = QuerySelector.getDefaultQueriesAttribute();
        }
        if (this.init && this.init.query) {
          this.initSelect(this.init.query.name);
        }
    }

    static getCatalog(lang: string) {
        switch(lang) {
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
            ${this.queries.defaultQuery.map((query: any, index: number) => this.getDefaultQueries(query, index))}
          </ul>
        </div>

        <!-- Additional Queries-->
        <div id="additionalQueries" class="card">
          <div class="card-header">
            <b>${translate("additionalQueriesTitle")}</b>
          </div>
          <ul class="list-group scroll" id="queries">
            ${this.queries.additionalQuery.map((query: any, index: number) => this.getAdditionalQueries(query, index))}
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

  private getDefaultQueries(query: any, index: number) {
    return html`
      ${this.isFiltered(query.displayName)
        ? html`
            <li
              class="list-group-item list-group-item-action 
                        ${classMap(this.isDefaultSelected(index) ? { active: true } : {})}"
              @click="${() => this.defaultSelect(query, index, true)}"
            >
              ${query.displayName}
            </li>
          `
        : html``}
    `;
  }

  private getAdditionalQueries(query: any, index: number) {
    return html`
      ${this.isFiltered(query.displayName)
        ? html`
            <li
              class="list-group-item list-group-item-action 
                        ${classMap(this.isAdditionalSelected(index) ? { active: true } : {})}"
              @click="${() => this.additionalSelect(query, index, true)}"
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
    Object.assign(arg, { value: value });
    this.dispatchEvent(
      new CustomEvent('filterChanged', {
        detail: this.filterArgs,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private select(query: any, sendEvent: boolean) {
    this.filterTitle = this.filterTitlePrefix + ' ' + query.query;
    this.selectedQuery = query.query;
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

  private defaultSelect(query: any, index: number, sendEvent: boolean) {
    this.select(query, sendEvent);
    this.defaultSelectedIndex = index;
    this.additionalSelectedIndex = undefined;
  }

  private additionalSelect(query: any, index: number, sendEvent: boolean) {
    this.select(query, sendEvent);
    this.additionalSelectedIndex = index;
    this.defaultSelectedIndex = undefined;
  }

  private isDefaultSelected(index: number) {
    return index === this.defaultSelectedIndex;
  }

  private isAdditionalSelected(index: number) {
    return index === this.additionalSelectedIndex;
  }

  private initSelect(initQueryName: string) {
    this.queries.defaultQuery.map((query: any, index: number) => {
      if (query.query === initQueryName) {
        this.defaultSelect(query, index, false);
      }
    });
    this.queries.additionalQuery.map((query: any, index: number) => {
      if (query.query === initQueryName) {
        this.additionalSelect(query, index, false);
      }
    });
  }

  private getFilterValue(queryName: string, filterName: string) : string {
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
    if (this.init && this.init.pagination) {
      return this.init.pagination.c;
    }
    return 10;
  }

  private getPaginationPageIndex(): number {
    if (this.init && this.init.pagination) {
      return this.init.pagination.p;
    }
    return 0;
  }

  private static getDefaultQueriesAttribute(): Object {
    return JSON.parse('{"defaultQuery": [], "additionalQuery": []}');
  }
}
