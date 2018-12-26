<template>
  <div class="card mt-3">
    <div class="card-body">
      <v-table
        :data="users"
        :hideSortIcons="true"
      >
        <thead slot="head">
          <v-th sortKey="name" defaultSort="asc">Name</v-th>
          <v-th sortKey="age">Age</v-th>
          <v-th sortKey="address.state">State</v-th>
        </thead>
        <tbody slot="body" slot-scope="{displayData}">
          <tr v-for="row in displayData" :key="row.guid">
            <td>{{ row.name }}</td>
            <td>{{ row.age }}</td>
            <td>{{ row.address.state }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
import users from './data.json'
import VTable from '../../../src/VTable.vue'
import VTh from '../../../src/VTh.vue'

export default {
  name: 'SortingFA',
  components: { VTable, VTh },
  data: () => ({
    users: users.slice(20, 30)
  })
}
</script>

<style>
  @import "~@fortawesome/fontawesome-free/css/all.css";
  @import "~bootstrap/dist/css/bootstrap.css";

  .vt-sort:before{
    font-family: "Font Awesome 5 Free";
    padding-right: 0.5em;
    width: 1.28571429em;
    display: inline-block;
    text-align: center;
  }

  .vt-sortable:before{
    content: "\f338";
  }

  .vt-asc:before{
    content: "\f160";
  }

  .vt-desc:before{
    content: "\f161";
  }
</style>


