import {css, customElement, html, LitElement, property} from 'lit-element';
import {unsafeHTML} from "lit-html/directives/unsafe-html";
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
  loader: (lang) => Promise.resolve(PbText.getCatalog(lang))
});

@customElement('pb-text')
export class PbText extends LitElement {

  @property({ attribute: 'lang', type: String, reflect: true })
  lang: string = "en";

  // Common properties below are handled by the div above pb-text:

  // @property({ attribute: 'width', type: String, reflect: true })
  // private width: string = "12";
  //
  // @property({ attribute: 'css-classes', type: String, reflect: true })
  // private cssClasses: string = "";
  //
  // @property({ attribute: 'hidden', type: Boolean, reflect: true })
  // private hidden: boolean = false;

  @property({ attribute: 'label-hidden', type: Boolean, reflect: true })
  private labelHidden: boolean = false;

  @property({ attribute: 'label', type: String, reflect: true })
  private label: string = "";

  @property({ attribute: 'label-position', type: String, reflect: true })
  private labelPosition: string = "top";

  @property({ attribute: 'label-width', type: String, reflect: true })
  private labelWidth: number = 4;

  @property({ attribute: 'text', type: String, reflect: true })
  private text: string = "";

  // User should take care to sanitize the 'text' content before using this.
  // See e.g. https://github.com/google/closure-library/blob/master/closure/goog/html/sanitizer/htmlsanitizer.js
  @property({ attribute: 'allow-html', type: Boolean, reflect: true })
  private allowHTML: boolean = false;

  @property({ attribute: 'alignment', type: String, reflect: true })
  private alignment: string = "left";

  constructor() {
    super();
    listenForLangChanged(() => {
      if (this.label === "") {
        this.label = get("defaultLabel");
      }
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

      .label-elem {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 5px;
      }     
    `;
  }

  render() {
    return html`
      <style>${bootstrapStyle}</style>
      <div class="form-group">
        ${this.getLabel()}
        <p
            class="${this.getParagraphCssClass()}"
        >${this.getTextValue()}</p>
      </div>
    `;
  }

  private getTextValue() {
    if (this.allowHTML) {
      return html`${unsafeHTML(this.text)}`
    }
    return html`${this.text}`
  }

  private getLabel() {
    if (this.labelHidden) {
      return html``;
    }
    return html`
        <label
          class="${this.getLabelCssClass()}"
        >${this.label}</label>
        `
  }

  private getLabelCssClass() : string {
    return "control-label label-elem " +
      " col-xs-" + (!this.labelHidden ? this.labelWidth : 12);
  }

  private getParagraphCssClass() : string {
    return "form-control-static  " + "text-" + this.alignment +
      " col-xs-" + (12 - (!this.labelHidden && this.labelPosition === 'left' ? this.labelWidth : 0));
  }

}
