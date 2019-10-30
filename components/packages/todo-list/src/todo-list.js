function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n            <li>\n              ", "\n            </li>\n          "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <input id=\"usernameInput\" name=\"username\" />\n      <button @click=\"", "\">\n        Add user\n      </button>\n      <ul>\n        ", "\n      </ul>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

import { LitElement, html } from 'lit-element';
export class TodoList extends LitElement {
  static get properties() {
    return {
      users: {
        type: Array
      }
    };
  }

  constructor() {
    super();
    this.users = ['Steve'];
  } // To access dom nodes imperatively, you can use regular query selectors on the element instance.
  // LitElement uses shadow dom, so the selector should be done on the shadowroot of the element.
  // Because of shadow dom, the selectors are scoped to only this element instance's dom.
  //
  // Be aware that the first render of the element happens async, so the requested dom nodes might
  // not be available when running this function.
  //
  // See the first-updated and updated examples for ways to access dom nodes more safely


  get usernameInput() {
    return this.shadowRoot.getElementById('usernameInput');
  }

  get username() {
    // Use the input getter, and get the value property from the input element
    return this.usernameInput.value;
  }

  render() {
    return html(_templateObject(), () => this._addUsername(), this.users.map(user => html(_templateObject2(), user)));
  }

  _addUsername() {
    this.users = [...this.users, this.username]; // Use the input getter and clear the value

    this.usernameInput.value = '';
  }

}
customElements.define('todo-list', TodoList);