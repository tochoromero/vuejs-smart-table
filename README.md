# VueJs Smart Table 

Vue Smart Table was created out of the need for a simple highly customizable data table plugin 
that could take advantage of Vue's slots. It has no dependencies but Vue and Vuex and because it 
renders as a standard HTML table it is compatible with CSS Frameworks such as Bootstrap and Foundation.

Out of the box you will get filtering, column sorting, client side pagination and row selection.

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

## Documentation
Please read the [documentation](https://cli.vuejs.org/config/) to learn how to use it.
