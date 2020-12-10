import { LitElement, html, css } from 'lit-element';
import { openWcLogo } from './open-wc-logo.js';
import 'mindee-js/build/web-components';
import mockApi from './mockApi.json';


export class AppMindee extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
      }

      main {
        flex-grow: 1;
      }

      .logo > svg {
        margin-top: 36px;
        animation: app-logo-spin infinite 20s linear;
      }

      @keyframes app-logo-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }
    `;
  }

  render() {
    let shapes=[];
    Object.entries(mockApi.predictions[0]).forEach(entry =>{
        console.log('entry', entry[1]);
        if(entry[1].segmentation){
          shapes.push({id:entry[0], coordinates: entry[1].segmentation.bounding_box });
        }
      }
    );

    return html`
    <annotation-viewer image="https://img.brut.media/thumbnail/californie-une-proposition-de-loi-pour-interdire-les-tickets-de-caisse-papier-e63571dc-f9b2-4e86-bac9-acbe54e96d9e-square.png" shapes="${shapes}"></annotation-viewer>
        <p>Edit <code>src/AppMindee.js</code> and save to reload.</p>
      <main>
        <div class="logo">${openWcLogo}</div>
        <h1>My app</h1>
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `;
  }
}
