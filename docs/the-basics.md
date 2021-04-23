# The Basics

The main goal for Vue Smart Table is to be very simple to use while offering powerful features out of the box.

To achieve this we mix Vue Components and vanilla HTML Elements with the output being the same as a traditional HTML Table.
This will allow you to easily customize your tables with CSS or with any framework such as Bootstrap or Tailwind CSS.

For our examples we decided to use Bootstrap and Font Awesome, but you can use whatever your heart desires.

Here is the code for the simplest table you can create:

<CodeGroup>
  <CodeGroupItem title="html" active>

```html
<template>
  <VTable :data="users">
    <template #head>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Email</th>
        <th>Address</th>
      </tr>
    </template>
    <template #body="{rows}">
      <tr v-for="row in rows" :key="row.id">
        <td>{{ row.name }}</td>
        <td>{{ row.age }}</td>
        <td>{{ row.email }}</td>
        <td>
          {{ row.address.street }},
          {{ row.address.city }}
          {{ row.address.state }}
        </td>
      </tr>
    </template>
  </VTable>
</template>
```

  </CodeGroupItem>

  <CodeGroupItem title="js">

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

  </CodeGroupItem>
</CodeGroup>

#### Result
<Basics />

## VTable
The `VTable` component is the main element of Smart Table, here you will provide most of hte configuration and listen to events.

### Data <Badge type="tip" text="array" vertical="top" />
`VTable` requires a `data` property, it must be an `array` even if it is initially empty.
Each entry in the array must be an object that represents a row in the table.

It is important to note the array will not be mutated by Smart Table, 
internally it will create a shallow copy to perform transformations on it.

### Head <Badge text="Slot" type="tip"/>
The `head` slot is for the table `thead`, other than specifying the slot name with `slot="head"` there is nothing special about this.
You just need to provide vanilla `tr` and `th` elements.
```html
<template #head">
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>Email</th>
      <th>Address</th>
    </tr>
</template>
```
### Body <Badge text="Slot" type="tip"/>
The `body` slot is for the table `tbody`. This is a scoped slot which provides a `rows` property.

The `rows` property provided by the `body` scoped slot is a shallow copy of the `data` array provided to the `VTable` component.

This array has all the transformations applied to it, for example, if filtering is enabled, this array will only contain the rows that pass the filters.

You will want to use a `v-for` directive to render the `tr` elements.

```html
<template #body="{rows}">
  <tr v-for="row in rows" :key="row.id">
    <td>{{ row.name }}</td>
    <td>{{ row.age }}</td>
    <td>{{ row.email }}</td>
    <td>
      {{ row.address.street }},
      {{ row.address.city }}
      {{ row.address.state }}
    </td>
  </tr>
</template>
```

All right, this is the simplest table you can create, but right now Smart Table is effectively doing nothing you might as well just use a vanilla html Table.

Please keep reading to learn more about the features Smart Table offers out of the box.
