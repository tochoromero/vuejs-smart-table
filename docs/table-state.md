# Table State

Smart Table takes the `data` array you provide, makes a copy of it and applies transformations
depending on the features you have enabled: sorting, filtering, selection and pagination.

Sometimes you want to have access to the data after Smart Table has applied the transformations.
A common use case would be to export the data as CSV. For those instances Smart Table exposes the
Table State whose typescript definition is:

```ts
interface TableState {
  rows: any[],
  rowsPrePagination: any[],
  selectedRows: any[]
}
```

##State Changed
Every time the transformations are applied `VTable` emits a `stateChanged` event, 
the payload of the event is the Table State:

<CodeGroup>
  <CodeGroupItem title="html" active>

```html
<VTable
  :data="users"
  @stateChanged="tableState = $event"
>
  <template #head>
    <th>Name</th>
      ...
  </template>
  <template #body="{ rows }">
    <tr
      v-for="row in rows"
      :key="row.guid"
    >
      <td>{{ row.name }}</td>
        ...
      </tr>
  </template>
</VTable>
```
</CodeGroupItem>

<CodeGroupItem title="js">

```js
<script>
import users from './users.json'

export default {
  data: () => ({
    users: users,
    tableState: null
  })
}
</script>
```
</CodeGroupItem>
</CodeGroup>

### rows
The `rows` property contains the rows that are currently visible in the table, 
it is the exact same object the `body` slot receives. These rows have all the transformations applied.

### rowsPrePagination
If you have pagination enabled, the `rows` property will only contain the rows for the current selected page.
But sometimes you want to get a hold of all the rows regardless of the current page. 
The `rowsPrePagination` property will contain all the rows with all but the pagination transformation applied.

### selectedRows
If you have selection enabled the `seletedRows` property will contain an array with the currently selected rows.
