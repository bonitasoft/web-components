import tmpl from '../bo-tree/template';
import {} from '../../bower_components/csak-tree/csak-tree.html';
import {} from '../../bower_components/csak-tree/csak-tree-item.html';
import CsakTreeBuilder from './src/CsakTreeBuilder';

class boTree extends HTMLElement {
  static get observedAttributes() {
    return ['json-tree', 'expanded', 'collapsed', 'filter'];
  }

  constructor() {
    super();

    if (!this.jsonTree) this.jsonTree = {};
    if (!this.expanded) this.expanded = {};
    if (!this.collapsed) this.collapsed = {};
    if (!this.filter) this.filter = '';
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
    this._csakTree = this.shadowRoot.querySelector('#csak-tree');
  }

  /**
   * `connectedCallback()` fires when the element is inserted into the DOM.
   * Useful for running setup code, such as fetching resources or rendering.
   * Generally, you should try to delay work until this time.
   */
  connectedCallback() {
    this.addEventListener('valueChange', this._render);
  }

  /**
   * `attributeChangedCallback()` is called when an observed attribute has been
   * added, removed, updated, or replaced. Also called for initial values when
   * an element is created by the parser, or upgraded.
   * Note: only attributes listed in the observedAttributes property will
   * receive this callback.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    this._render();
    let csak = this.shadowRoot.querySelector('#tree1');
    if (name === 'json-tree' || name === 'filter') {
      csak.data = new CsakTreeBuilder(this.jsonTree, this.filter).build();
    }
  }

  get jsonTree() {
    try {
      return JSON.parse(this.getAttribute('json-tree'));
    } catch {
      return {};
    }
  }

  collapseAll() {
    this.shadowRoot.querySelector('#tree1').collapseAll();
  }

  expandAll() {
    this.shadowRoot.querySelector('#tree1').expandAll();
  }

  set jsonTree(value) {
    this.setAttribute('json-tree', JSON.stringify(value));
  }

  get expanded() {
    return this.getAttribute('expanded');
  }

  set expanded(value) {
    this.setAttribute('expanded', value);
  }

  get filter() {
    return this.getAttribute('filter');
  }

  set filter(value) {
    this.setAttribute('filter', value);
  }

  get collapsed() {
    return this.getAttribute('collapsed');
  }

  set collapsed(value) {
    this.setAttribute('collapsed', value);
  }

  _render() {
    this._csakTree.innerHTML = `<csak-tree id="tree1" 
                   class="classictreeview"                  
                   branchiconopen='${this.expanded}'
                   branchicon='${this.collapsed}'
                   expanded>
        </csak-tree>`;
  }
}

// This is where the actual element is defined for use in the DOM
customElements.define('bo-tree', boTree);
