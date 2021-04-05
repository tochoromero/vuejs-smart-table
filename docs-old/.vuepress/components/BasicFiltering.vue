<template>
  <div class="card mt-3">
    <div class="card-body">
      <label>Filter by Name:</label>
      <input class="form-control" v-model="filters.name.value"/>

      <v-table
        :data="users"
        :filters="filters"
      >
        <thead slot="head">
        <th>Name</th>
        <th>Age</th>
        <th>Email</th>
        <th>Address</th>
        </thead>
        <tbody slot="body" slot-scope="{displayData}">
        <tr v-for="row in displayData" :key="row.guid">
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
          <td>{{ row.email }}</td>
          <td>{{ row.address.street }}, {{ row.address.city }} {{ row.address.state}}</td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
import users from './data.json'
import VTable from '../../../src/VTable.vue'

export default {
  name: 'BasicFiltering',
  components: { VTable },
  data: () => ({
    users: users.slice(0, 10),
    filters: {
      name: { value: '', keys: ['name'] }
    }
  })
}
</script>

<style lang="scss" scoped>
  @import '~bootstrap/dist/css/bootstrap.min.css';
</style>
