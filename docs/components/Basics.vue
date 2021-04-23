<template>
  <div>
    <VTable :data="users">
      <template #head>
        <tr>
          <VTh sort-key="name" default-sort="asc">Name</VTh>
          <th>Age</th>
          <th>Email</th>
          <th>Address</th>
        </tr>
      </template>
      <template #body="{rows}">
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
          <td>{{ row.email }}</td>
          <td>
            {{ row.address.street }},
            {{ row.address.city }}
            {{ row.address.state }}
          </td>
        </tr>
      </template>
    </VTable>
  </div>
</template>

<script>
import users from './users.json'
import VTh from '../../src/VTh'

export default {
  name: 'Basics',
  components: { VTh },
  data: () => ({
    users: users.splice(0, 10)
  })
}
</script>
