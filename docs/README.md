# Introduction

Vue Smart Table was created out of the need for a simple highly customizable data table plugin 
that could take advantage of Vue's slots. It has no dependencies but Vue and Vuex and because it 
renders as a standard HTML table it is compatible with CSS Frameworks such as Bootstrap and Foundation.

Out of the box you will get filtering, column sorting, client side pagination and row selection.

## Installation
To install simply run
```
npm add vue-simple-table
```
or
```
yarn add vue-simple-table
```

Then in your `main.js`
```js
import SimpleTable from 'vue-simple-table'

Vue.use(SimpleTable)
```
