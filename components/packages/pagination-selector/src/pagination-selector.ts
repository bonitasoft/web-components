import { css, customElement, html, LitElement } from 'lit-element';

@customElement('pagination-selector')
export class PaginationSelector extends LitElement {

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
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />

      <!-- Pagination card -->
      <div class="card">
        <div class="card-header">
          <b>Pagination</b>
        </div>
        <div class="pagination-container">
          <div class="pagination-item">
            <label for="elem">Element (c)</label>
            <div class="input-group pagination-input">
              <input
                type="text"
                class="form-control pagination-input"
                id="elem"
                value="10"
                @input=${(e: any) => this.nbElementsChanged(e.target.value)}
                placeholder="Type a number of elements"
              />
              <div class="input-group-append">
                <span class="input-group-text pagination-input">¶</span>
              </div>
            </div>
          </div>
          <div class="pagination-item">
            <label for="page">Page number (p)</label>
            <div class="input-group pagination-input">
              <input
                type="text"
                class="form-control pagination-input"
                id="page"
                value="0"
                @input=${(e: any) => this.pageNumberChanged(e.target.value)}
                placeholder="Type a page number"
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
