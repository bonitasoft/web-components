import tmpl from './template.js';
import '../bo-expanded-select/index';
import mapping from './mapping-property';

// We define an ES6 class that extends HTMLElement
class BoSwitchConfig extends HTMLElement {
  static get observedAttributes() {
    return ['from', 'to', 'dictionary'];
  }

  /**
   * The element's constructor is run anytime a new instance is created.
   * Instances are created either by parsing HTML, calling
   * document.createElement('bo-string-concat'), or calling new BoStringConcatElement();
   * Useful for initializing state, settings up event listeners, or creating shadow dom.
   */
  constructor() {
    super();

    if (!this.from) this.from = {};
    if (!this.to) this.to = {};
    if (!this.dictionary) this.dictionary = {};

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tmpl.content.cloneNode(true));

    // We can query the shadow root for internal elements
    this._to = this.shadowRoot.querySelector('#to-properties');
    this._headerTitle = this.shadowRoot.querySelector('#header-title');

    this._renderResult = this._renderResult.bind(this);
    this.resetMapping = this.resetMapping.bind(this);
  }

  /**
   * `connectedCallback()` fires when the element is inserted into the DOM.
   * Useful for running setup code, such as fetching resources or rendering.
   * Generally, you should try to delay work until this time.
   */
  connectedCallback() {
    this.addEventListener('valueChange', this._renderResult);
  }

  /**
   * `attributeChangedCallback()` is called when an observed attribute has been
   * added, removed, updated, or replaced. Also called for initial values when
   * an element is created by the parser, or upgraded.
   * Note: only attributes listed in the observedAttributes property will
   * receive this callback.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'to' || name === 'dictionary') {
        this._render();
        this._renderResult();
      }
    }
  }

  get from() {
    //TODO: try/catch to avoid parsing object in json when attribute is not yet evaluated by AngularJS
    try {
      return JSON.parse(this.getAttribute('from'));
    } catch {
      return { name: '', options: {} };
    }
  }

  set from(value) {
    this.setAttribute('from', JSON.stringify(value));
  }

  get dictionary() {
    //TODO: try/catch to avoid parsing object in json when attribute is not yet evaluated by AngularJS
    try {
      return JSON.parse(this.getAttribute('dictionary'));
    } catch {
      return {};
    }
  }

  set dictionary(value) {
    this.setAttribute('dictionary', JSON.stringify(value));
  }

  get to() {
    try {
      return JSON.parse(this.getAttribute('to'));
    } catch {
      return { name: '', options: {} };
    }
  }

  set to(value) {
    this.setAttribute('to', JSON.stringify(value));
  }

  /**
   * `disconnectedCallback()` fires when the element is removed from the DOM.
   * It's a good place to do clean up work like releasing references and
   * removing event listeners.
   */
  disconnectedCallback() {
    this.removeEventListener('valueChange', this._renderResult);
  }

  /**
   * Create property mapping and display it
   * @private
   */
  _render() {
    this._headerTitle.innerHTML = `
    <div class="title-area"><b>${this.from.name || ''}</b> ${this._translate('Properties')}</div>
    <div class="title-area"><b>${this.to.name || this._translate('Target')}</b> ${this._translate(
      'Properties'
    )}</div>
    <div class="title-area">${this._translate('Value')}</div>`;
    let content = Object.keys(this.to.options).map(
      keyTo =>
        `<bo-expanded-select selected='${keyTo}' key='${keyTo}'>
           <div slot="label"><b>${this._translate(
             this.to.options[keyTo].label
           )}</b> ${this._addBondIcon(this.to.options[keyTo].bond)}</div>
           <bo-expanded-select-option id='' value='${this.to.options[keyTo].value ||
             this.to.options[keyTo].defaultValue}'></bo-expanded-select-option>` +
        Object.keys(this.from.options)
          .map(
            keyFrom =>
              `<bo-expanded-select-option id='${keyFrom}' value='${this.from.options[keyFrom]
                .value + '' || this.from.options[keyFrom].defaultValue + ''}'>
            ${this._translate(this.from.options[keyFrom].label)}
            </bo-expanded-select-option>`
          )
          .join('') +
        `</bo-expanded-select>`
    );

    this._to.innerHTML = content.join('');
  }

  _addBondIcon(bond) {
    switch (bond) {
      case 'constant':
        return '';
        break;
      case 'interpolation':
        return '(¶)';
        break;
      case 'expression':
        return '(fx)';
        break;
      case 'variable':
        return '(⚭)';
      default:
        return '';
        break;
    }
  }

  _renderResult() {
    this.result = JSON.stringify(this._getMappingResult(), null);
  }

  _getMappingResult() {
    let optionsFrom = this.from['options'];
    let optionsTo = this.to['options'];
    this._allProperties = this._to.querySelectorAll('bo-expanded-select');

    let props = [];
    this._allProperties.forEach(prop => {
      props.push({ selected: prop.selected, key: prop.selected ? prop.getAttribute('key') : '' });
    });

    let result = Object.assign({}, { id: this.to['id'], name: this.to['name'], options: {} });
    result.options = mapping(optionsFrom, optionsTo, props);

    return result;
  }

  resetMapping() {
    this._allProperties = this._to.querySelectorAll('bo-expanded-select');
    this._allProperties.forEach(prop => {
      prop.selected = prop.getAttribute('key');
    });
  }

  _translate(key) {
    if (this.dictionary && this.dictionary[key]) {
      return this.dictionary[key];
    }
    return key;
  }
}

// This is where the actual element is defined for use in the DOM
customElements.define('bo-switch-config', BoSwitchConfig);
