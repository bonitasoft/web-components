/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
import { customElement, LitElement, property, html } from 'lit-element';

@customElement('bo-card-bootstrap')
export class boCardBootstrap extends LitElement {
  @property() name = 'Michel ça farte ?';

  toto() {
    console.log('michel');
  }

  render() {
    this.toto();
    return html`
         <link rel="stylesheet" href="bootstrap/dist/css/bootstrap.min.css">
         <div class="card" style="width: 18rem;">  
                  <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Hello, ${this.name}!</p>    
                  </div>
                </div>`;
  }
}
