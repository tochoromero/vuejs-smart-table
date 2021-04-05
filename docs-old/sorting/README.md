# Sorting

To enable column sorting, instead of using vanilla `th` elements we will use `v-th` Components for the columns
that will allow sorting.

## Table Header <Badge text="Component"/> <Badge text="v-th"/>
The `v-th` component renders to a regular `th` element but it allows you to sort the table, it has three properties:
`sortKey`, `customSort` and `defaultSort`.

### Sort Key <Badge text="Propery"/> <Badge text="sortKey: String | Function"/>
The `sortKey` property is used to get the Row value we will sort by it can either be a `String` or a `Function`.

#### String
As a `String`, it represents the path to the property in the Row we want to sort. You can even use nested paths.
```html
<thead slot="head">
    <v-th sortKey="name">Name</v-th>
    <v-th sortKey="address.state">State</v-th>
</thead>
```

#### Function
If you instead pass a `Function`, we will call it with the current `row` as a parameter and expect to get back
the value used for sorting.
```html
<thead slot="head">
    <v-th :sortKey="nameLength">Name</v-th>
</thead>
```

```js
methods: {
  nameLength (row) {
    return `row.name.length`
  }
}
```

Once we have used the `key` property to get the column values, we will compare them. 
If the values are number we will just compare them by subtraction.
Otherwise we will call `toString()` on them and compare them with `localCompare`.

### Custom Sort <Badge text="Property"/> <Badge text="customSort: Function"/>
In some cases you need more control over sorting, 
for instance if you have a complex object or your sorting depends in two or more values. 
For those instances instead of providing a `key` property you can use the `custom` property to provide a sorting function.

The function will receive the 2 rows being compared and a third parameter with the sort order 
where `1` represents ascending and `-1` represents descending.
The function needs to return `1` if the first row is greater, `-1` if the second row is greater 
or `0` if they are the same.

```html
<thead slot="head">
    <v-th :customSort="dateSort">Registered</v-th>
</thead>
```

```js
methods: {
  dateSort(a, b) {
    let date1 = new Date(a.registered).getTime();
    let date2 = new Date(b.registered).getTime();
    
    return date1 - date2;
  }
}
```

### Default Sort <Badge text="Property"/> <Badge text="defaultSort: String"/>
You should provide this for the one column you want the table to be sorted by default. 
The possible values are: `asc` for ascending ordering and `desc` for descending order.

```html
<thead slot="head">
    <v-th sortKey="name" defaultSort="desc">Name</v-th>
</thead>
```

### Example
```html
<template>
  <v-table
    :data="users"
  >
    <thead slot="head">
      <v-th :sortKey="nameLength" defaultSort="desc">Name</v-th>
      <v-th sortKey="age">Age</v-th>
      <v-th sortKey="address.state">State</v-th>
      <v-th :customSort="dateSort">Registered</v-th>
    </thead>
    <tbody slot="body" slot-scope="{displayData}">
      <tr v-for="row in displayData" :key="row.guid">
        <td>{{ row.name }}</td>
        <td>{{ row.age }}</td>
        <td>{{ row.address.state }}</td>
        <td>{{ row.registered }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
```

```js
<script>
import users from './users.json'

export default {
  name: 'Sorting',
  data: () => ({
    users
  }),
  methods: {
    nameLength (row) {
      return row.name.length
    },
    dateSort(a, b) {
      let date1 = new Date(a.registered).getTime();
      let date2 = new Date(b.registered).getTime();
      
      return date1 - date2;
    }
  }
}
</script>
```

<Sorting/>

## CSS icons
By default we include three SVG icons to indicate the sorting state of a column. 
But you can use CSS Styles to change the sort icons.

The first thing you need to do is to disable the default sort icons with the `hideSortIcons` property on the `v-table` component:

```html
<v-table
    :data="users"
    :hideSortIcons="true"
>
...
</v-table>
```

Then you will get 4 CSS classes for `th` elements with sorting enabled:

* `vt-sort`: This class is always present, its purpose is to provide a constant CSS class for the columns with sorting.
* `vt-sortable`: This class indicates the column can be sorted and it is present when the column is not currently sorted.
* `vt-asc`: This class indicates the column is being sorted by an ascending order.
* `vt-desc`: This class indicates the column is being sorted by a descending order.

For this example we will use FontAwesome icons:

```css
.vt-sort:before{
    font-family: FontAwesome;
    padding-right: 0.5em;
    width: 1.28571429em;
    display: inline-block;
    text-align: center;
}

.vt-sortable:before{
    content: "\f0dc";
}

.vt-asc:before{
    content: "\f160";
}

.vt-desc:before{
    content: "\f161";
}
```

<SortingFA/>
