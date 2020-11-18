# `pb-text`

![npmVersion](https://img.shields.io/npm/v/@bonitasoft/pb-text?color=blue&style=plastic)

Simple text web component

## Attributes

- `lang`            (default: en)
- `label-hidden`    (default: false)
- `label`           (default: "Default label")
- `label-position`  (default: top)
- `label-width`     (default: 4)
- `text`            (default: empty)
- `alignment`       (default: left)
- `allow-html`      (default: false)

Note: If `allow-html` is set, this is unsafe to use the `text` attribute with any user-provided input that hasn't been
      sanitized or escaped, as it may lead to cross-site-scripting vulnerabilities.

## Usage

Run:

    npm install @bonitasoft/pb-text

Then import `node_modules/@bonitasoft/pb-text/lib/pb-text.es5.min.js`

And you can use new html tag `<pb-text lang="fr" text="My text"></pb-text>`
