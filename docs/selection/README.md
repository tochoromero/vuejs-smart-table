# Row Selection

## Table Row <Badge text="Component"/> <Badge text="v-tr"/>
To enable row selection you need to use the `v-tr` component. It only has one property: `row`

### Row <Badge text="Property"/> <Badge text="row: Object"/> <Badge text="Required"/>
You must provide the `row` property with the current Object for the row.

## Selection Options
You can configure the Selection Mode and the Selected Class in the `v-table` component.

### Selection Mode <Badge text="Property"/> <Badge text="selectionMode: String"/> <Badge text="default: single"/>
By default the selection mode is `single`, meaning only one row at a time can be selected.
You can use the `selectionMode` property in the `v-table` component to set it to `multiple`, so multiple rows
can be selected.

### Selected Class <Badge text="Property"/> <Badge text="selectedClass: String"/> <Badge text="default: vt-selected"/>
When a row is selected a class is added to the `tr` element, by default it is `vt-selected` byt you can change it to
something else with the `selectedClass` property in the `v-table` component.

## Selection Changed <Badge text="Event"/> <Badge text="selectionChanged: Array"/>
When the selected items changes the `v-table` component will emit a `selectionChanged` event with the
list of selected items as its payload.

## Example

```html
<template>
    <div>
      <v-table
        class="table-hover"
        :data="users"
        selectionMode="multiple"
        selectedClass="table-info"
        @selectionChanged="selectedRows = $event"
      >
        <thead slot="head">
        <th>Name</th>
        <th>Age</th>
        <th>State</th>
        <th>Registered</th>
        </thead>
        <tbody slot="body" slot-scope="{displayData}">
        <v-tr
          v-for="row in displayData"
          :key="row.guid"
          :row="row"
        >
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
          <td>{{ row.address.state }}</td>
          <td>{{ row.registered }}</td>
        </v-tr>
        </tbody>
      </v-table>
    
      <strong>Selected:</strong>
      <div v-if="selectedRows.length === 0" class="text-muted">No Rows Selected</div>
      <ul>
        <li v-for="selected in selectedRows">
          {{ selected.name }}
        </li>
      </ul>
    </div>
</template>
```

```js
<script>
  import users from './users.json'

  export default {
    name: 'Selection',
    data: () => ({
      users,
      selectedRows: []
    })
  }
</script>
```
<Selection/>
