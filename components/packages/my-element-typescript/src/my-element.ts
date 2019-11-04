/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
import { customElement, LitElement, property, html } from 'lit-element';

@customElement('my-element')
export class myElement extends LitElement {
  @property() name = 'Michel ça farte ?';


  toto(){
    console.log('michel');
  }
  render() {
    this.toto();
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
