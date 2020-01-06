# &lt;bo-switch-config&gt;

## Demo

Put url demo here

## Usage

1. Import polyfill:

   ```html
   <script src="YOUR_PATH/webcomponentsjs/webcomponents.min.js"></script>
   ```

2. Import custom element:

   ```html
   <script type="module" src="YOUR_PATH/bo-switch-config.esm.min.js"></script>
   <script nomodule src=".YOUR_PATH/bo-switch-config.es5.min.js" defer></script>
   ```

   First line is use in modern browser, second in older (like IE)

3. Start using it!

   ```html
   <bo-switch-config
     id="wc1"
     dictionary="{'Cancel':'Annuler','Start':'Commencer'}"
     from='{"id": "pbInput","name":"Input","options":{"cssClasses":{"type":"constant","value":"","label":"CSS classes"},"hidden":{"type":"constant","value":false,"label":"Hidden"},"required":{"type":"constant","value":false,"label":"Required"}}'
     to='{"id": "pbDataTable","name":"Data Table","options":{"headers":{"label":"Headers","name":"headers","caption":"Comma-separated list","help":"If you specify an expression, the result must be an array of strings","type":"collection","defaultValue":["Id","Name","Description","Date"],"bond":"expression"},"type":{"label":"Data source","name":"type","help":"Variable for frontend paging and ordering or Bonita REST API URL for backend paging and ordering","type":"choice","defaultValue":"Bonita API","choiceValues":["Variable","Bonita API"],"bond":"constant"}}'
   ></bo-switch-config>
   ```

   You need to add a <bo-expanded-select-option> for each option you want to display in select box.

## Options

| Attribute    | Options  | Default | Description                                                                  |
| ------------ | -------- | ------- | ---------------------------------------------------------------------------- |
| `dictionary` | _string_ | `{}`    | JSON object to follow this format: {"key":"","value":"","key":"","value":""} |
| `from`       | _string_ | `{}`    | JSON object to follow this format: {"type":"","value":"","label":""}         |
| `to`         | _string_ | `{}`    | JSON object to follow this format: {"type":"","value":"","label":""}         |
