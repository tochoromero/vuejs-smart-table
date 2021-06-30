:fire::fire::fire: Vue 3 support is comming :fire::fire::fire:

Vue 3 support is already in beta in the `next` branch, the next version also supports Vue 2, you can take a look in the [new documentation site](https://vue-smart-table.netlify.app/).

# VueJs Smart Table

Vue Smart Table was created out of the need for a simple highly customizable data table plugin 
that could take advantage of Vue's slots. It has no dependencies but Vue and because it 
renders as a standard HTML table it is compatible with CSS Frameworks such as Bootstrap and Foundation.

Out of the box you will get filtering, column sorting, client side pagination and row selection.

## Full Documentation
Please read the [documentation](https://tochoromero.github.io/vuejs-smart-table/) to learn how to use it.

## Installation
To install simply run
```
npm add vuejs-smart-table
```
or
```
yarn add vuejs-smart-table
```

Then in your `main.js`
```js
import SmartTable from 'vuejs-smart-table'

Vue.use(SmartTable)
```
This will globally register four Components: `v-table`, `v-th`, `v-tr` and `smart-pagination`
