import {css, customElement, html, LitElement, property} from 'lit-element';
import "@songhay/input-autocomplete";
// @ts-ignore
import bootstrapStyle from './style.scss';

import {registerTranslateConfig, use} from "lit-translate";
import * as i18n_en from "./i18n/en.json";
import * as i18n_es from "./i18n/es-ES.json";
import * as i18n_fr from "./i18n/fr.json";
import * as i18n_ja from "./i18n/ja.json";
import * as i18n_pt from "./i18n/pt-BR.json";
import {HttpVerb} from "./HttpVerb";

// Registers i18n loader
registerTranslateConfig({
  loader: (lang) => Promise.resolve(HttpActionEditor.getCatalog(lang))
});

@customElement('http-action-editor')
export class HttpActionEditor extends LitElement {

  @property({ attribute: 'lang', type: String, reflect: true })
  lang: string = "en";

  @property({ attribute: 'http-verb', type: String, reflect: true })
  private httpVerb: HttpVerb = HttpVerb.GET;

  @property({ attribute: 'http-url', type: String, reflect: true })
  private httpUrl: string;

  @property({ attribute: 'http-data', type: String, reflect: true })
  private httpData: string | undefined;

  @property({ attribute: 'status-code', type: Number, reflect: true })
  private statusCode: number | undefined;

  @property({ attribute: 'rsp-header', type: String, reflect: true })
  private rspHeader: string | undefined;

  @property({ attribute: 'success-rsp-value', type: String, reflect: true })
  private successRspValue: string | undefined;

  @property({ attribute: 'failed-rsp-value', type: String, reflect: true })
  private failedRspValue: string | undefined;

  @property({ attribute: 'success-value-use-this', type: Boolean, reflect: false })
  private successValueUseThis: boolean = true;

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
        font-size: 14px;
        text-align: left;
        padding: 10px 10px 10px 0px;
      }

      .action-item {
        padding: 10px 0 0 0;
      }
      
      .action-input {
        font-size: 14px;
      }


     .action-item.required .control-label:after {
        content: '*';
        color: red;
      }

      .http-verb-container {
        display: flex;
        flex-wrap: wrap;
         padding: 0 0 15px 0;
         width: 100%;
      }
      
      .http-verb-item {
          flex-grow: 1;
      }

    `;
  }


  render() {
    return html`
      <style>${bootstrapStyle}</style>
      <div id="request" class="card">
          <div class="card-body">
              ${this.httpVerbChoice()}
              <div class="action-item required">
                <label class="control-label" for="url">URL</label>
                <input type="text" class="form-control action-input"
                       id="url"
                       @input=${(e: any) => this.httpUrl = e.target.value}
                />
              </div>
              <div class="action-item">
                  ${this.dataToSend()}
              </div>
          </div>
      </div>
      <br>
      <br>
      <br>
      <label>Response</label>
      <br>
      <label>Define how the output of your external API will be stored</label>
      <br>
      <label>Success value</label>
      <br>
      ${this.successValueChoice()}
      <br>
      <br>
      <label>Other response value value</label>
      <br>
      <br>
      <label for="failedRspValue">Failure value</label>
      <input type="text"
             id="failedRspValue"
             @input=${(e: any) => this.failedRspValue = e.target.value}
      />
      <br><br>
      <label for="statusCode">Status code</label>
      <input type="text"
             id="statusCode"
             @input=${(e: any) => this.statusCode = e.target.value}
      />
      <br>
      <br>
      <label for="rspHeader">Response header</label>
      <input type="text"
             id="rspHeader"
             @input=${(e: any) => this.rspHeader = e.target.value}
      />
    `;

  }

  private httpVerbChoice() {
    return html`
        <div class="http-verb-container">
            <div class="http-verb-item">
              <input type="radio" id="getChoice"
                     name="httpVerb" value="get" checked @change=${() => this.httpVerbChanged(HttpVerb.GET)}>
              <label for="getChoice">GET</label>
            </div>
            <div class="http-verb-item">
              <input type="radio" id="postChoice"
                     name="httpVerb" value="post" @change=${() => this.httpVerbChanged(HttpVerb.POST)}>
              <label for="postChoice">POST</label>
            </div>
            <div class="http-verb-item">
              <input type="radio" id="putChoice"
                     name="httpVerb" value="put" @change=${() => this.httpVerbChanged(HttpVerb.PUT)}>
              <label for="putChoice">PUT</label>
            </div>
            <div class="http-verb-item">
              <input type="radio" id="deleteChoice"
                     name="httpVerb" value="delete" @change=${() => this.httpVerbChanged(HttpVerb.DELETE)}>
              <label for="deleteChoice">DELETE</label>
            </div>
        </div>
    `;
  }

  private successValueChoice() {
    return html`
        <div>
            <input type="radio" id="thisActionChoice"
                   name="successValue" value="thisAction" @change=${() => this.successValueUseThisChanged(true)}>
            <label for="thisActionChoice">Use this action</label>
            <br>
            <input type="radio" id="variableChoice"
                   name="successValue" value="variable" @change=${() => this.successValueUseThisChanged(false)}>
            <label for="variableChoice">Use a variable</label>
            <input type="text"
                   id="successRspValue"
                   ?disabled="${this.successValueUseThis}"
                   .value="${this.successRspValue ?? ''}"
                   @input=${(e: any) => this.successRspValue = e.target.value}
            />
        </div>
 
    `;
  }

  private dataToSend() {
  return html`
      ${this.httpVerb === HttpVerb.POST || this.httpVerb === HttpVerb.PUT
              ? html`
          <label for="data">Data to send</label>
          <div class="input-group">
              <input type="text" class="form-control"
                     id="data"
                     @input=${(e: any) => this.httpData = e.target.value}
              />
              <div class="input-group-append">
                  <span class="input-group-text">x</span>
              </div>
          </div>
      `
      : html``}
  `;
  }

  private httpVerbChanged(verb: HttpVerb) {
    console.log("verbChanged: " + verb);
    this.httpVerb = verb;
  }

  private successValueUseThisChanged(successValueUseThis: boolean) {
    console.log("successValueUseThisChanged: " + successValueUseThis);
    this.successValueUseThis = successValueUseThis;
    this.successRspValue = undefined;
  }


  // @ts-ignore
  private rxAutoComplete() {
    return html`
    <rx-input-autocomplete
    inputId="my-input"
    maxSuggestions="5"
    minInput="0"
    placeholder="enter here"
      >
      <label>one</label>
      <label>two</label>
      </rx-input-autocomplete>
      `;
  }

  // @ts-ignore
  private dropDownStatusCode() {
    return html`
    <div class="dropdown">
    <input type="text"
    class="dropdown-toggle"
    data-toggle="dropdown"
    id="statusCode"
  @input=${(e: any) => this.statusCode = e.target.value}
      />
      <div class="dropdown-menu">
    <a class="dropdown-item" href="#">Link 1</a>
    <a class="dropdown-item" href="#">Link 2</a>
    <a class="dropdown-item" href="#">Link 3</a>
    </div>
    </div>
  `;
  }
}
