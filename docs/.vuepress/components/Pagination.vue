<template>
  <div class="card mt-3">
    <div class="card-body">
      <v-table
        :data="users"
        :currentPage.sync="currentPage"
        :pageSize="5"
        @totalPagesChanged="totalPages = $event"
      >
        <thead slot="head">
          <th>Name</th>
          <th>Age</th>
          <th>State</th>
          <th>Registered</th>
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

      <smart-pagination
        :currentPage.sync="currentPage"
        :totalPages="totalPages"
      />
    </div>
  </div>
</template>

<script>
import users from './data.json'
import VTable from '../../../src/VTable.vue'
import SmartPagination from '../../../src/SmartPagination.vue'

export default {
  name: 'Pagination',
  components: { VTable, SmartPagination },
  data: () => ({
    users: users.slice(0, 30),
    currentPage: 1,
    totalPages: 0
  })
}
</script>

<style>
  @import "~bootstrap/dist/css/bootstrap.css";
</style>
