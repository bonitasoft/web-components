import { css, customElement, html, LitElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import 'search-box';
import 'pagination-selector';
// @ts-ignore
import bootstrapStyles from './style.scss';
import {get, listenForLangChanged, registerTranslateConfig, translate, use} from "lit-translate";
import * as i18n_en from "./i18n/en.json";
import * as i18n_fr from "./i18n/fr.json";

// Registers i18n loader
registerTranslateConfig({
    loader: (lang) => Promise.resolve(QuerySelector.getCatalog(lang))
});

@customElement('query-selector')
export class QuerySelector extends LitElement {

    @property({ attribute: 'lang', type: String, reflect: true })
    lang: string = "en";

    @property({ attribute: 'queries', type: Object, reflect: true })
  private queries: any = JSON.parse('{"defaultQuery": [], "additionalQuery": []}');

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
            this.filterTitlePrefix = get("query.filterTitlePrefix");
            this.filterTitle = this.filterTitlePrefix;
        });
    }

    async connectedCallback() {
        use(this.lang).then();
        super.connectedCallback();
    }

    static getCatalog(lang: string) {
        switch(lang) {
            case "fr":
                return i18n_fr;
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
        font-weight: bold;
      }

      .guide {
        color: grey;
        text-align: center;
        font-style: italic;
      }
      search-box {
        --max-width: 100%;
      }
    `;
  }

  render() {
    return html`
      <style>${bootstrapStyles}</style>
      <div class="guide">
        ${translate("query.help")}
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
            <b>${translate("query.defaultQueriesTitle")}</b>
          </div>
          <ul class="list-group scroll" id="queries">
            ${this.queries.defaultQuery.map((query: any, index: number) => this.getDefaultQueries(query, index))}
          </ul>
        </div>

        <!-- Additional Queries-->
        <div id="additionalQueries" class="card">
          <div class="card-header">
            <b>${translate("query.additionalQueriesTitle")}</b>
          </div>
          <ul class="list-group scroll" id="queries">
            ${this.queries.additionalQuery.map((query: any, index: number) => this.getAdditionalQueries(query, index))}
          </ul>
        </div>
      </div>
      <br />

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
      ></pagination-selector>
      <br />

      <!-- Tips-->
      <p><span class="tip">Tip:</span> ${translate("query.tip1")}</p>
      <p><span class="tip">Tip:</span> ${translate("query.tip2")}</p>
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
              @click="${() => this.defaultSelect(query, index)}"
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
              @click="${() => this.additionalSelect(query, index)}"
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

  private select(query: any) {
    this.filterTitle = this.filterTitlePrefix + ' ' + query.query;
    this.selectedQuery = query.query;
    this.filterArgs = query.filters;
    this.dispatchEvent(
      new CustomEvent('querySelected', {
        detail: this.selectedQuery,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private defaultSelect(query: any, index: number) {
    this.select(query);
    this.defaultSelectedIndex = index;
    this.additionalSelectedIndex = undefined;
  }

  private additionalSelect(query: any, index: number) {
    this.select(query);
    this.additionalSelectedIndex = index;
    this.defaultSelectedIndex = undefined;
  }

  private isDefaultSelected(index: number) {
    return index === this.defaultSelectedIndex;
  }

  private isAdditionalSelected(index: number) {
    return index === this.additionalSelectedIndex;
  }
}
