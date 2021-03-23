import {css, customElement, html, LitElement, property} from 'lit-element';
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
  loader: (lang) => Promise.resolve(PbInput.getCatalog(lang))
});

@customElement('pb-input')
export class PbInput extends LitElement {

  private name = "pbInput";

  @property({ attribute: 'lang', type: String, reflect: true })
  lang: string = "en";

  // Common properties below are handled by the div above pb-input:

  // @property({ attribute: 'width', type: String, reflect: true })
  // private width: string = "12";
  //
  // @property({ attribute: 'css-classes', type: String, reflect: true })
  // private cssClasses: string = "";
  //
  // @property({ attribute: 'hidden', type: Boolean, reflect: true })
  // private hidden: boolean = false;

  @property({ attribute: 'id', type: String, reflect: true })
  private idRoot: string = "";

  @property({ attribute: 'required', type: Boolean, reflect: true })
  private required: boolean = false;

  @property({ attribute: 'min-length', type: String, reflect: true })
  private minLength: string = "";

  @property({ attribute: 'max-length', type: String, reflect: true })
  private maxLength: string = "";

  @property({ attribute: 'readonly', type: Boolean, reflect: true })
  private readOnly: boolean = false;

  @property({ attribute: 'label-hidden', type: Boolean, reflect: true })
  private labelHidden: boolean = false;

  @property({ attribute: 'label', type: String, reflect: true })
  private label: string = "";

  @property({ attribute: 'label-position', type: String, reflect: true })
  private labelPosition: string = "top";

  @property({ attribute: 'label-width', type: String, reflect: true })
  private labelWidth: string = "4";

  @property({ attribute: 'placeholder', type: String, reflect: true })
  private placeholder: string = "";

  @property({ attribute: 'value', type: String, reflect: true })
  private value: string = "";

  @property({ attribute: 'type', type: String, reflect: true })
  private type: string = "text";

  @property({ attribute: 'min', type: String, reflect: true })
  private min: string = "";

  @property({ attribute: 'max', type: String, reflect: true })
  private max: string = "";

  @property({ attribute: 'step', type: String, reflect: true })
  private step: string = "1";


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
      }

      .input-elem {
        font-size: 14px;
        height: 20px;
      }
      
      .label-elem {
        font-size: 14px;
        font-weight: 700;
        padding-left: 0
      }
      
      /* Add a red star after required inputs */
      .label-required:after {
        content: " *";
        color: #C00;
      }
      
      .text-right {
        text-align: right; 
      }

    `;
  }

  render() {
    return html`
      <style>${bootstrapStyle}</style>
      <div id="${this.idRoot}" class="container">
        <div class="row">
          ${this.getLabel()}
          <input 
            class="${this.getInputCssClass()}"
            id="input"
            name="${this.name}"
            type="${this.type}"
            min="${this.min}"
            max="${this.max}"
            step="${this.step}"
            value="${this.value}"
            @input=${(e: any) => this.valueChanged(e.target.value)} 
            placeholder="${this.placeholder}"
            minlength="${this.minLength}"
            maxlength="${this.maxLength}"
            ?readonly="${this.readOnly}"
          />
        </div>
      </div>
    `;
  }

  private getLabel() {
    if (this.labelHidden) {
      return html``;
    }
    return html`
        <label
          class="${this.getLabelCssClass()}"
          for="input"
        >${this.label}</label>
        `
  }

  private getLabelCssClass() : string {
    return (this.required ? "label-required " : "") + "label-elem form-horizontal col-form-label " +
      (!this.labelHidden && this.labelPosition === 'left' ? "col-" + this.labelWidth + " text-right" : "col-12");
  }

  private getInputCssClass() : string {
    return "form-control input-elem col";
  }

  private valueChanged(value: string) {
    this.dispatchEvent(new CustomEvent('valueChange', { detail: value }));
  }

}
