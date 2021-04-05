<template>
  <div class="card mt-3">
    <div class="card-body">
      <v-table
        class="table-hover"
        ref="usersTable"
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
  </div>
</template>

<script>
  import users from './data.json'
  import VTable from '../../../src/VTable.vue'
  import VTr from '../../../src/VTr.vue'

  export default {
    name: 'Selection',
    components: { VTable, VTr },
    data: () => ({
      users: users.slice(0, 10),
      selectedRows: []
    })
  }
</script>

<style>
  @import "~bootstrap/dist/css/bootstrap.css";
</style>
