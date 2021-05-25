//https://github.com/GoogleChromeLabs/howto-components/blob/master/elements/howto-accordion/howto-accordion.js
import style from './style.scss';

/********************************* BoExpandedSelect ******************************************/
let tmpl = document.createElement('template');
tmpl.innerHTML = `
  <style> ${style}</style>
  <div class="bo-select"></div>
  <slot name="label">Label</slot>    
  <div id="property-value"></div>   
  `;

class BoExpandedSelect extends HTMLElement {
  static get observedAttributes() {
    return ['selected'];
  }

  constructor() {
    super();

    // Init option with <bo-expanded-select-option> Tag
    this._options = this.querySelectorAll(`bo-expanded-select-option`);
    this.options = Object.values(this._options).map(opt => {
      return {
        id: opt.getAttribute('id'),
        value: opt.getAttribute('value'),
        text: opt.textContent,
        disabled: opt.getAttribute('disabled')
      };
    });

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
    this._propertyValue = this.shadowRoot.querySelector('#property-value');
  }

  connectedCallback() {
    this._render(this.options);
  }

  _render(options) {
    this._generateSelectBox(options);
    this.shadowRoot.querySelector('select').addEventListener('change', this._onChange.bind(this));
  }

  /**
   * Generate selectBox
   *   <select>
   *     <option value="" val=""></option>
   *   </select>
   * @param options
   * @private
   */
  _generateSelectBox(options) {
    let optionsHtml = [];
    options.forEach(o => {
      optionsHtml.push(`<option value="${o.id}" val="${o.value.toString()}" ${o.disabled === 'true' ? 'disabled' :''}>${o.text}</option>`);
    });
    let innerHtml = `<select class="form-control">${optionsHtml.join('')}</select>`;

    this.shadowRoot.querySelector('.bo-select').innerHTML = innerHtml;

    // Initialise select box
    let selectedNode = this.shadowRoot.querySelector('select');
    selectedNode.value =
      this.selected && this._isAvailableOption(this.options, this.selected) ? this.selected : '';

    let val = selectedNode.options[selectedNode.options.selectedIndex].getAttribute('val');
    this._setPropertyValue(val === 'undefined' ? '' : val);
  }

  _onChange(event) {
    let selectedNode = event.target.options[event.target.selectedIndex];
    this._setPropertyValue(selectedNode.getAttribute('val'));
    this.selected = selectedNode.getAttribute('value');
  }

  attributeChangedCallback(name, oldId, newId) {
    if (name === 'selected' && oldId != newId) {
      let selectedNode = this.shadowRoot.querySelector('select');
      if (selectedNode) {
        selectedNode.value =
          this.selected && this._isAvailableOption(this.options, this.selected)
            ? this.selected
            : '';
        this._setPropertyValue(
          selectedNode.options[selectedNode.options.selectedIndex].getAttribute('val')
        );
      }

      this.dispatchEvent(
        new CustomEvent('valueChange', {
          composed: true,
          bubbles: true
        })
      );
    }
  }

  get selected() {
    return this.getAttribute('selected');
  }

  set selected(id) {
    let availableOption = this.options.filter(o => o.id === id);
    this.setAttribute('selected', availableOption.length > 0 ? id : '');
  }

  _isAvailableOption(options, valToFind) {
    let availableOption = options.filter(o => o.id === valToFind);
    return availableOption.length > 0;
  }

  disconnectedCallback() {
    this.removeEventListener('change', this._onChange);
  }

  _setPropertyValue(value) {
    this._propertyValue.innerHTML = value === 'undefined' ? '' : value;
  }
}

// This is where the actual element is defined for use in the DOM
customElements.define('bo-expanded-select', BoExpandedSelect);
