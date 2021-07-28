<template>
  <div class="card">
    <VTable
        ref="usersTable"
        :data="users"
        selectionMode="multiple"
        :selectOnClick="false"
        @stateChanged="selectedRows = $event.selectedRows"
    >
      <template #head="{ allRowsSelected, toggleAllRows }">
        <th>
          <input
              type="checkbox"
              :checked="allRowsSelected"
              @change="toggleAllRows"
          />
        </th>
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
          v-slot="{ isSelected, toggle}"
      >
        <td>
          <input
              type="checkbox"
              :checked="isSelected"
              @change="toggle"
          />
        </td>
        <td>{{ row.name }}</td>
        <td>{{ row.age }}</td>
        <td>{{ row.address.state }}</td>
        <td>{{ row.registered }}</td>
      </VTr>
      </template>
    </VTable>

    <strong>Selected:</strong>
    <div v-if="selectedRows.length === 0">No rows selected</div>
    <ul>
      <li v-for="selected in selectedRows">
        {{ selected.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import users from './users.json'

export default {
  name: 'Selection',
  data: () => ({
    users: users.slice(0, 10),
    selectedRows: []
  })
}
</script>
