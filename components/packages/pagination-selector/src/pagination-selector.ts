import { css, customElement, html, LitElement, property } from 'lit-element';
// @ts-ignore
import bootstrapStyles from './style.scss';
import {registerTranslateConfig, translate, use} from "lit-translate";
import * as i18n_en from "./i18n/en.json";
import * as i18n_fr from "./i18n/fr.json";

// Registers i18n loader
registerTranslateConfig({
    loader: (lang) => Promise.resolve(PaginationSelector.getCatalog(lang))
});

@customElement('pagination-selector')
export class PaginationSelector extends LitElement {

    @property({ attribute: 'lang', type: String, reflect: true })
    lang: string = "en";

    @property({attribute: 'nb-elements', type: Number, reflect: true})
    private nbElements: number = 10;

    @property({attribute: 'page-index', type: Number, reflect: true})
    private pageIndex: number = 0;

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
        text-align: left;
        padding: 10px 0px 10px 0px;
      }

      .pagination-container {
        display: flex;
        flex-wrap: wrap;
      }

      .pagination-item {
        padding: 5px;
        flex-grow: 1;
        max-width: 50%;
      }

      .pagination-input {
        font-size: 14px;
      }
    `;
  }

  render() {
    return html`
      <style>${bootstrapStyles}</style>
      <!-- Pagination card -->
      <div class="card">
        <div class="card-header">
          <b>${translate("pagination.title")}</b>
        </div>
        <div class="pagination-container">
          <div class="pagination-item">
            <label for="elem">${translate("pagination.nbelements")}</label>
            <div class="input-group pagination-input">
              <input
                type="text"
                class="form-control pagination-input"
                id="elem"
                value=${this.nbElements}
                @input=${(e: any) => this.nbElementsChanged(e.target.value)}
                placeholder=${translate("pagination.nbelementsPlaceholder")}
              />
              <div class="input-group-append">
                <span class="input-group-text pagination-input">¶</span>
              </div>
            </div>
          </div>
          <div class="pagination-item">
            <label for="page">${translate("pagination.pageindex")}</label>
            <div class="input-group pagination-input">
              <input
                type="text"
                class="form-control pagination-input"
                id="page"
                value=${this.pageIndex}
                @input=${(e: any) => this.pageNumberChanged(e.target.value)}
                placeholder=${translate("pagination.pageindexPlaceholder")}
              />
              <div class="input-group-append">
                <span class="input-group-text pagination-input">¶</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private pageNumberChanged(value: string) {
    this.dispatchEvent(
      new CustomEvent('paginationPagesChanged', {
        detail: value,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private nbElementsChanged(value: string) {
    this.dispatchEvent(
      new CustomEvent('paginationElementsChanged', {
        detail: value,
        bubbles: true,
        composed: true,
      }),
    );
  }
}
