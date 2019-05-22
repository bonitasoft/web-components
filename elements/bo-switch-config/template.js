import styles from './style.scss';

let tmpl = document.createElement('template');
tmpl.innerHTML = `
    <style>${styles}</style>    
    <section id="to">     
      <div id="header-title"></div>        
      <div id="to-properties"></div>
    </section>      
`;

export default tmpl;
