<template>
  <div class="card">
    <label class="form-label">Min Age:</label>

    <input
        class="form-input"
        type="number"
        v-model.number="filters.age.value.min"
        :min="0"
        :max="filters.age.value.max"
        @onKeyDown.prevent="() => {}"
    />

    <label class="form-label" style="margin-left: 16px">Max Age:</label>
    <input
        class="form-input"
        type="number"
        v-model.number="filters.age.value.max"
        :min="filters.age.value.min"
        :max="99"
        @onKeyDown.prevent="() => {}"
    />

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

export default {
  name: 'CustomFiltering',
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
