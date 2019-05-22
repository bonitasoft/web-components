# &lt;bo-expanded-select&gt;

## Demo

Put url demo here

## Usage

1. Import polyfill:

   ```html
   <script src="YOUR_PATH/webcomponentsjs/webcomponents.min.js"></script>
   ```

2. Import custom element:

   ```html
   <script type="module" src="../../dist/bo-expanded-select.esm.min.js"></script>
   <script nomodule src="../../dist/bo-expanded-select.es5.min.js" defer></script>
   ```

   First line is use in modern browser, second in older (like IE)

3. Start using it!

   ```html
   <bo-expanded-select selected="label">
     <div slot="label">Width</div>
     <bo-expanded-select-option id="" value="DefaultValue"></bo-expanded-select-option>
     <bo-expanded-select-option id="label" value="Username">Label</bo-expanded-select-option>
     <bo-expanded-select-option id="width" value="4">Width</bo-expanded-select-option>
   </bo-expanded-select>
   ```

   You need to add a <bo-expanded-select-option> for each option you want to display in select box.

## Options

| Attribute  | Options  | Default                                                                                  | Description |
| ---------- | -------- | ---------------------------------------------------------------------------------------- | ----------- |
| `selected` | _string_ | `` | Id to select by default (if selected is not found in option id, default will be '') |
