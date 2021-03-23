# `pb-text`

![npmVersion](https://img.shields.io/npm/v/@bonitasoft/pb-text?color=blue&style=plastic)

Simple text web component

## Attributes

| Attribute        | Type      | Default | Possible values    |
|------------------|-----------|---------|--------------------|
| `alignment`      | `string`  | "left"  | left center right  |
| `allow-html`     | `boolean` | false   |                    |
| `id`             | `string`  | ""      |                    |
| `label`          | `string`  | ""      |                    |
| `label-hidden`   | `boolean` | false   |                    |
| `label-position` | `string`  | "top"   | left top           |
| `label-width`    | `number`  | 4       |                    |
| `lang`           | `string`  | "en"    |en es-ES fr ja pt-BR|
| `text`           | `string`  | ""      |                    |

Note: If `allow-html` is set, this is unsafe to use the `text` attribute with any user-provided input that hasn't been
      sanitized or escaped, as it may lead to cross-site-scripting vulnerabilities.

## Usage

Run:

    npm install @bonitasoft/pb-text

Then import `node_modules/@bonitasoft/pb-text/lib/pb-text.es5.min.js`

And you can use new html tag `<pb-text text="My text"></pb-text>`
