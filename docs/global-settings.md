# Global Settings

When you install Vue Smart Table, you can optionally pass an object to globally configure certain behaviours.

Any of these settings can be set directly on each Smart Table instance, but it is much easier to do it once globally.
Through the documentation you will see a `Global` badge on certain settings, that means the setting can be set globally.

| Setting      | Description | Documentation
| ----------- | ----------- | ----------- |
| sortIconPosition      | Allows to set the position of the sort icons       | [Sort Icon Position](/sorting.md#sort-icon-position)
| sortHeaderClass   | Adds additional classes to the `th` header        | [Sort Header Class](/sorting.md#sort-header-class)
| hideSortIcons   | Hides the default sort icons so you can provide your own        | [Hide Sort Icons](/sorting.md#hide-sort-icons)
| selectOnClick   | Determines whether or not a row is selected when clicked        | [Select On Click](/selection.md#select-on-click)

## Example
```js
import SmartTable from 'vuejs-smart-table'

Vue.use(SmartTable, {
  sortIconPosition: 'before',
  sortHeaderClass: 'custom-header',
  hideSortIcons: true,
  selectOnClick: false
})
```
