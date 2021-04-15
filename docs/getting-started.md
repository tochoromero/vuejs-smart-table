# Getting Started

### Why Smart Table
There are a lot of Data Table plugins out there, some of them are very good but pretty much all of them are very complicated to use.
What I really wanted was the simplicity of a vanilla HTML table but with the power of the more complex Data Table plugins.

Vue Smart Table is the answer to that need. Creating a Smart Table is almost as simply as creating a Vanilla HTML Table.
When you need it, you can enable extra functionality in a way that feels natural. It is very straight forward, you can learn everything you need to know on one sit.

### Installation
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
This will globally register four Components: `VTable`, `VTh`, `VTr` and `VTPagination`
