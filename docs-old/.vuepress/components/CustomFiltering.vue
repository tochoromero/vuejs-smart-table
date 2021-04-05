<template>
  <div class="card mt-3">
    <div class="card-body">
      <label>Min Age:</label>

      <InputSpinner
        v-model="filters.age.value.min"
        :min="0"
        :max="filters.age.value.max"
        inputWidth="100px"
      />

      <label>Max Age:</label>
      <InputSpinner
        v-model="filters.age.value.max"
        :min="filters.age.value.min"
        :max="99"
        inputWidth="100px"
      />

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
          <td>
            {{ row.address.street }},
            {{ row.address.city }}
            {{ row.address.state}}
          </td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
import users from './data.json'
import VTable from '../../../src/VTable.vue'
import InputSpinner from './InputSpinner'

export default {
  name: 'CustomFiltering',
  components: { InputSpinner, VTable },
  data () {
    return {
      users,
      filters: {
        age: { value: { min: 21, max: 22 }, custom: this.ageFilter }
      }
    }
  },
  methods: {
    ageFilter (filterValue, row) {
      return row.age >= filterValue.min && row.age <= filterValue.max
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~bootstrap/dist/css/bootstrap.min.css';
  @import '~@fortawesome/fontawesome-free/css/all.css';
</style>
