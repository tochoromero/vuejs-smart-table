<template>
  <v-table
    :data="data"
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
</template>

<script>
import data from './data.json'
import VTable from '../../../src/VTable.vue'

export default {
  name: 'TheBasics',
  components: { VTable },
  data: () => ({
    data: data.slice(0, 5)
  })
}
</script>
