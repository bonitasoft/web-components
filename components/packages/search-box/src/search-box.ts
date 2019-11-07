import { css, customElement, html, LitElement } from 'lit-element';

@customElement('search-box')
export class SearchBox extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        text-align: left;
        padding: 10px 10px 10px 0px;
      }

      .search-input {
        font-size: 16px;
      }
    `;
  }

  render() {
    return html`
      <input class="search-input" @input=${(e: any) => this.valueChanged(e.target.value)} placeholder="&#x1F50D;Search queries" autocomplete="off" type="search" />
    `;
  }

  private valueChanged(value: string) {
    this.dispatchEvent(new CustomEvent('valueChange', { detail: value }));
  }
}
