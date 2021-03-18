import { css, customElement, html, LitElement, property } from 'lit-element';
// @ts-ignore
import bootstrapStyle from './style.scss';
import {get, listenForLangChanged, registerTranslateConfig, use} from "lit-translate";
import * as i18n_en from "./i18n/en.json";
import * as i18n_es from "./i18n/es-ES.json";
import * as i18n_fr from "./i18n/fr.json";
import * as i18n_ja from "./i18n/ja.json";
import * as i18n_pt from "./i18n/pt-BR.json";

// Registers i18n loader
registerTranslateConfig({
  loader: (lang) => Promise.resolve(SearchBox.getCatalog(lang))
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
      this.placeholder = get("placeholder");
    });
  }

  async attributeChangedCallback(name: string, old: string|null, value: string|null) {
    super.attributeChangedCallback(name, old, value);
    if (name === 'lang') {
      use(this.lang).then();
    }
  }

  static getCatalog(lang: string) {
    switch(lang) {
      case "es":
      case "es-ES":
        return i18n_es;
      case "fr":
        return i18n_fr;
      case "ja":
        return i18n_ja;
      case "pt":
      case "pt-BR":
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
        text-align: left;
        padding: 10px 10px 10px 0px;
        max-width: var(--max-width, 50%);
      }

      .search-input {
        font-size: 14px;
      }
    `;
  }

  render() {
    return html`
      <style>${bootstrapStyle}</style>
      <input class="form-control search-input" @input=${(e: any) => this.valueChanged(e.target.value)} placeholder="&#x1F50D;${this.placeholder}" autocomplete="off" type="search" />
    `;
  }

  private valueChanged(value: string) {
    this.dispatchEvent(new CustomEvent('valueChange', { detail: value }));
  }
}
