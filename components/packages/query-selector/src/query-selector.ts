import { css, customElement, html, LitElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import 'search-box';
import 'pagination-selector';

@customElement('query-selector')
export class QuerySelector extends LitElement {
  @property({ type: Object, reflect: true })
  private queries: any = JSON.parse('{"defaultQuery": [], "additionalQuery": []}');

  @property({ type: String })
  private selectedQuery = '';

  @property({ type: Array })
  private filterArgs = [];

  @property({ type: String })
  private queryFilter = '';

  private static readonly filterTitlePrefix = 'Filter the query of';
  private filterTitle: string = QuerySelector.filterTitlePrefix;
  private defaultSelectedIndex: number | undefined = undefined;
  private additionalSelectedIndex: number | undefined = undefined;

  constructor() {
    super();
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
    `;
  }

  render() {
    return html`
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />

      <div class="guide">
        Select a query from one of the 2 lists. If any, enter the filter value(s)
      </div>
      <!-- Query card -->
      <search-box
        id="searchbox"
        @valueChange=${(e: any) => {
          this.queryFilterChanged(e.detail);
        }}
      ></search-box>
      <div class="card-deck">
        <!-- Default Queries-->
        <div id="defaultQueries" class="card">
          <div class="card-header">
            <b>"Find By" queries on an attribute</b>
          </div>
          <ul class="list-group scroll" id="queries">
            ${this.queries.defaultQuery.map((query: any, index: number) => this.getDefaultQueries(query, index))}
          </ul>
        </div>

        <!-- Additional Queries-->
        <div id="additionalQueries" class="card">
          <div class="card-header">
            <b>Additional queries</b>
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
      <pagination-selector></pagination-selector>
      <br />

      <!-- Tips-->
      <p><span class="tip">Tip:</span> Now, add the widgets to the whiteboard that will use this variable.</p>
      <p><span class="tip">Tip:</span> The return type of this variable is an array.</p>
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
    this.filterTitle = QuerySelector.filterTitlePrefix + ' ' + query.query;
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
