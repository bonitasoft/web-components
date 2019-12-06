import { css, customElement, html, LitElement, property } from 'lit-element';
// @ts-ignore
import bootstrapStyles from './style.scss';

@customElement('pagination-selector')
export class PaginationSelector extends LitElement {

  @property({ attribute: 'nb-elements', type: Number, reflect: true })
  private nbElements: number = 10;

  @property({ attribute: 'page-index', type: Number, reflect: true })
  private pageIndex: number = 0;

  @property({ type: Boolean})
  private isCollapsed: boolean = true;

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
        max-height:100px;
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
      .accordion-close {
        max-height:0;
        transition: max-height 0.2s ease;           
        overflow: hidden;   
      } 
      .accordion-open {
        max-height: 100px;
        transition: max-height 0.2s ease;
         overflow:hidden;
      }                
    `;
  }

  render() {
    return html`
      <style>${bootstrapStyles}</style>
      <!-- Pagination card -->
      <div class="card">
        <div class="card-header" @click="${this.handleCollapse}">                      
          <i>${this.isCollapsed ? '►' : '▼'}</i>  
          <b>Pagination</b>
        </div>
        <div class="pagination-container ${this.isCollapsed ? 'accordion-close' : 'accordion-open'}">
          <div class="pagination-item">
            <label for="elem">Element (c)</label>
            <div class="input-group pagination-input">
              <input
                type="text"
                class="form-control pagination-input"
                id="elem"
                value=${this.nbElements}
                @input=${(e: any) => this.nbElementsChanged(e.target.value)}
                placeholder="Type a number of elements"
              />
              <div class="input-group-append">
                <span class="input-group-text pagination-input">¶</span>
              </div>
            </div>
          </div>
          <div class="pagination-item">
            <label for="page">Page index (p)</label>
            <div class="input-group pagination-input">
              <input
                type="text"
                class="form-control pagination-input"
                id="page"
                value=${this.pageIndex}
                @input=${(e: any) => this.pageNumberChanged(e.target.value)}
                placeholder="Type a page index"
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

  private handleCollapse() {
    this.isCollapsed = !this.isCollapsed;
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
