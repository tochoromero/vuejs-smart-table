<template>
  <div class="card">
    <label class="form-label">Filter by Name:</label>
    <input class="form-input" v-model="filters.name.value"/>

    <VTable
        :data="users"
        :filters="filters"
    >
      <template #head>
        <th>Name</th>
        <th>Age</th>
        <th>Email</th>
        <th>Address</th>
      </template>
      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.guid">
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
          <td>{{ row.email }}</td>
          <td>{{ row.address.street }}, {{ row.address.city }} {{ row.address.state }}</td>
        </tr>
      </template>
    </VTable>
  </div>
</template>

<script>
import users from './users.json'

export default {
  name: 'BasicFiltering',
  data: () => ({
    users: users.slice(0, 10),
    filters: {
      name: { value: '', keys: ['name'] }
    }
  })
}
</script>
