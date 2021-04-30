<template>
  <div class="card">
    <button @click="selectAll">Select All</button>
    <button @click="deselectAll" style="margin-left: 16px">Deselect All</button>

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
  }),
  mounted () {
    this.$refs.usersTable.selectRows([users[0], users[1], users[2]])
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
