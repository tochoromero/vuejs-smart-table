# The Basics

The main goal for Vue Smart Table is to be intuitive to use while offering powerful features out of the box.
 
To achieve this we mix Vue Components and vanilla HTML Elements with the output being the same as a traditional HTML Table.
This will allow you to easily customize your tables with CSS or with a framework such as Bootstrap or Foundation.

For our examples we decided to use Bootstrap and Font Awesome, but you can use whatever your heart desires.

Here is the code for the simplest table you can create:

```js
<script>
import users from './users.json'

export default {
  name: 'TheBasics',
  data: () => ({
    users
  })
}
</script>

```

```html
<template>
  <v-table :data="users">
    <thead slot="head">
        <th>Name</th>
        <th>Age</th>
        <th>Email</th>
        <th>Address</th>
    </thead>
    <tbody slot="body" slot-scope="{displayData}">
        <tr v-for="row in displayData" :key="row.id">
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
          <td>{{ row.email }}</td>
          <td>
              {{ row.address.street }}, 
              {{ row.address.city }} 
              {{ row.address.state}}
          </td>
        </tr>
    </tbody>
  </v-table>
</template>
```

<TheBasics/>

## Table <Badge text="Component" type="success"/> <Badge text="v-table"/>

The `v-table` component is the main element of Smart Table, here you will provide most of the configuration and listen for events. 
But for now we will just focus on the `data` attribute.

### Data <Badge text="Property" type="success"/> <Badge text="data: Array"/>
Each `v-table` requires a `data` property, it must be an `array` even if it is initially empty.
Each entry in the array represents a row in the table.

It is important to note the array will not be mutated by Smart Table, internally it will create a shallow copy of it to perform
the operations.

## Head <Badge text="Slot" type="success"/> <Badge text="head"/>
The `head` slot is for the table `thead`, other than specifying the slot name with `slot="head"` there is nothing special about this.
You just need to provide vanilla `th` elements for each of your columns.
```html
<thead slot="head">
    <th>Name</th>
    <th>Age</th>
    ...
</thead>
```

## Body <Badge text="Scoped Slot" type="success"/> <Badge text="body"/>
The `body` slot is for the table `tbody`. This is a scoped slot which provides a `displayData` property.

### Display Data <Badge text="Slot Scope"/> <Badge text="displayData: array" type="success"/>
The `display-data` property provided by the `body` scoped slot is a shallow copy of the `data` array provided to the `v-table` component.

This array has all the plugins applied to it, for example, if filtering is enabled, this array will only contain the rows that pass the filters.

You will want to use a `v-for` directive to render the `tr` elements, remember, each entry in the `display-data` array represents a row.

```html
<tbody slot="body" slot-scope="{displayData}">
    <tr v-for="row in displayData" :key="row.id">
      <td>{{ row.name }}</td>
      <td>{{ row.age }}</td>
      ...
    </tr>
</tbody>
```

All right, this is the simplest table you can create, but right now Smart Table is effectively doing nothing you might as well just use a vanilla Html Table. 

Keep browsing to discover how powerful Smart Table is out of the box.
