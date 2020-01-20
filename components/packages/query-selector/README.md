# `query-selector`

![npmVersion](https://img.shields.io/npm/v/@bonitasoft/query-selector?color=blue&style=plastic)

Query selector web component. Display, filter, select queries. Provide values if arguments are required.
Depends on `@bonitasoft/search-box` and `@bonitasoft/pagination-selector` web components.
Generates events when:

- A query is selected: `querySelected`
- A filter argument is entered: `filterChanged`
- Pagination info is entered (see `pagination-selector`)

## Usage

Run:

    npm install @bonitasoft/query-selector

Then import `node_modules/@bonitasoft/query-selector/query-selector.es5.min.js`

And you can use new html tag, for example:
 
 `<query-selector queries='{"defaultQuery": [{"displayName": "name", "query": "findByName", "filters": [{"name": "name", "type": "String"}]}], "additionalQuery": [{"displayName": "find", "query": "find", "filters": []}]}'></query-selector>`


