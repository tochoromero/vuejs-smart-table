# Row Selection

## Table Row <Badge text="VTr"/>
To enable row selection you need to use the `VTr` component. It only has one property: `row`

### Row <Badge text="object"/>
You must provide the `row` property with the current Object for the row:

```html
<VTable :data="users">
      <template #head>
        <th>Name</th>
        ...
      </template>
      <template #body="{ rows }">
        <VTr
          v-for="row in rows"
          :key="row.guid"
          :row="row"
        >
          <td>{{ row.name }}</td>
          ...
        </VTr>
      </template>
    </VTable>
```

## Selection Options
You can configure the Selection Mode and the Selected Class in the `VTable` component.

### Selection Mode <Badge text="'single' | 'multiple'"/>
By default, the selection mode is `single`, meaning only one row at a time can be selected.
You can use the `selectionMode` property in the `VTable` component to set it to `multiple`, so multiple rows
can be selected.

### Selected Class <Badge text="string"/>
When a row is selected a class is added to the `tr` element, by default it is `vt-selected` but you can change it to
something else with the `selectedClass` property in the `VTable` component.

## Get selected rows
`VTable` exposes the selected rows with the `stateChanged` event. Every time the selection changes the event is triggered.
The `stateChanged` payload object includes a `selectedRows` property with our selected rows. 
You can listen to the event and store the selected rows locally for your use:

<CodeGroup>
  <CodeGroupItem title="html" active>

```html
<template>
  <VTable
    :data="users"
    @stateChanged="selectedRows = $event.selectedRows"
  >
    ...
  </VTable>
</template>
```
</CodeGroupItem>
  <CodeGroupItem title="js">

```js
<script>
  import users from './users.json'

  export default {
    data: () => ({
      users,
      selectedRows: []
    })
  }
</script>
```
  </CodeGroupItem>

</CodeGroup>

You can learn more about the `stateChanged` event in the [Table State](/table-state.md) section.

## Selection API
We also provide an API to perform some selection actions such as selecting all the rows.
These are functions that are exposed in the `VTable` component. 
The first thing you need to do is to get a `ref` to the `VTable` component:

```html
<template>
  <VTable
    :data="users",
    :ref="usersTable"
  >
    ...
  </VTable>
</template>
```

Once we have a ref, we can now call a couple of functions to manipulate the table selection:

### Select All
The `selectAll` function will select all the rows in the table. 

If you have pagination enabled we will still select all the rows even the ones that are not currently visible.

```js
<script>
  export default {
    methods: {
      selectAll () {
        this.$refs.usersTable.selectAll()
      }
    }
  }
</script>
```

### Deselect All
The `deselectAll` function will deselect all the rows in the table currently selected.

If you have pagination enabled we will still deselect all the rows even the ones that are not currently visible.

```js
<script>
  export default {
    methods: {
      deselectAll () {
        this.$refs.usersTable.deselectAll()
      }
    }
  }
</script>
```

### Select Rows
Clicking on a row is not the only way to select rows, you can also select them programmatically.
For instance, you may want your table to have a couple of rows selected by default.

For those instances you can use the `selectRows` function. The function only has one parameter `rows` which is an array of rows to select.

```js
<script>
  import users from './users.json'

  export default {
    data: () => ({
      users: users
    }),
  mounted () {
    const toSelect = [users[0], users[1], users[2]]
    this.$refs.usersTable.selectRows(toSelect)
  }
</script>
```

:::warning
For the `selectRows` function to work properly, the `rows` parameter must contain objects that exist in the `data` property of the `VTable` components.
In other words, the `rows` parameter must be a subset of the `data` property.
:::

:::warning
If the `selectionMode` is `single` and you provide more than one object in the `rows` parameter, only the last object in the array will be selected.
:::

## Example

<CodeGroup>
  <CodeGroupItem title="html" active>

```html
<template>
  <div>
    <button @click="selectAll">Select All</button>
    <button @click="deselectAll">Deselect All</button>

    <VTable
      ref="usersTable"
      :data="users"
      selectionMode="multiple"
      selectedClass="selected-row"
      @stateChanged="selectedRows = $event.selectedRows"
    >
      <template #head>
        <th>Name</th>
        <th>Age</th>
        <th>State</th>
        <th>Registered at</th>
      </template>
      <template #body="{ rows }">
        <VTr
          v-for="row in rows"
          :key="row.guid"
          :row="row"
        >
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
          <td>{{ row.address.state }}</td>
          <td>{{ row.registered }}</td>
        </VTr>
      </template>
    </VTable>

    <strong>Selected:</strong>
    <div v-if="selectedRows.length === 0">
      No rows selected
    </div>
    <ul>
      <li v-for="selected in selectedRows">
        {{ selected.name }}
      </li>
    </ul>
  </div>
</template>
```
</CodeGroupItem>
  <CodeGroupItem title="js">

```js
<script>
import users from './users.json'

export default {
  data: () => ({
    users: users,
    selectedRows: []
  }),
  mounted () {
    const toSelect = [users[0], users[1], users[2]]
    this.$refs.usersTable.selectRows(toSelect)
  },
  methods: {
    selectAll () {
      this.$refs.usersTable.selectAll()
    },
    deselectAll () {
      this.$refs.usersTable.deselectAll()
    }
  }
}
</script>
```
  </CodeGroupItem>

</CodeGroup>

<Selection/>
