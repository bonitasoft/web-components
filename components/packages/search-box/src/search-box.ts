import {css, customElement, html, LitElement, property} from 'lit-element';
import {get, listenForLangChanged, registerTranslateConfig, use} from "lit-translate";

// Registers i18n loader
registerTranslateConfig({
  loader: lang => fetch(`dist/assets/i18n/${lang}.json`).then(res => res.json())
});

@customElement('search-box')
export class SearchBox extends LitElement {

  @property({ attribute: 'placeholder', type: String, reflect: true })
  private placeholder: string = "";

  @property({ attribute: 'lang', type: String, reflect: true })
  lang: string = "en";


  constructor() {
    super();
    listenForLangChanged(() => {
      // We do not use translate() directive in render() since placeholder is an exposed attribute
      this.placeholder = get("app.placeholder");
    });
  }

  async connectedCallback() {
    // do not use i18n strings if attribute is set
    if (!this.placeholder) {
      use(this.lang).then();
    }
    super.connectedCallback();
  }

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
      <input class="search-input" @input=${(e: any) => this.valueChanged(e.target.value)} placeholder="&#x1F50D;${this.placeholder}" autocomplete="off" type="search" />
    `;
  }

  private valueChanged(value: string) {
    this.dispatchEvent(new CustomEvent('valueChange', { detail: value }));
  }
}
