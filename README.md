# Vue Smart Table

There are a lot of Data Table plugins out there, some of them are very good but pretty much all of them are very complicated to use.
What I really wanted was the simplicity of a vanilla HTML table but with the power of the more complex Data Table plugins.

Vue Smart Table is the answer to that need. Creating a Smart Table is almost as simply as creating a Vanilla HTML Table.
When you need it, you can enable extra functionality in a way that feels natural. It is very straight forward, you can learn everything you need to know on one sit.

## Documentation
You can find the documentation [here](https://vue-smart-table.netlify.app).

### Installation
To install simply run
```
npm install vuejs-smart-table@next
```
or
```
yarn add vuejs-smart-table@next
```

Then in your `main.js`
```js
import SmartTable from 'vuejs-smart-table'

Vue.use(SmartTable)
```

This will globally register four Components: `VTable`, `VTh`, `VTr` and `VTPagination`

### For Vue 2
This plugin uses [Vue Demi](https://github.com/vueuse/vue-demi) to create a universal package that works in both Vue 2 and Vue 3.
But in order for it to work in Vue 2 in addition go installing Vue Smart Table, you need to install the composition api package.

```
npm install @vue/composition-api
```
or
```
yarn add @vue/composition-api
```
