<template>
  <div class="card">
    <VTable
        :data="users"
        :page-size="5"
        v-model:currentPage="currentPage"
        @totalPagesChanged="totalPages = $event"
    >
      <template #head>
        <th>Name</th>
        <th>Age</th>
        <th>State</th>
        <th>Registered</th>
      </template>
      <template #body="{rows}">
        <tr v-for="row in rows" :key="row.guid">
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
          <td>{{ row.address.state }}</td>
          <td>{{ row.registered }}</td>
        </tr>
      </template>
    </VTable>

    <VTPagination
        v-model:currentPage="currentPage"
        :total-pages="totalPages"
        :boundary-links="true"
    />
  </div>
</template>

<script>
import users from './users.json'

export default {
  name: 'Pagination',
  data: () => ({
    users: users.slice(0, 30),
    totalPages: 1,
    currentPage: 1
  })
}
</script>

<style lang="scss">
.vt-pagination {
  .pagination {
    display: flex;
    list-style: none outside none;

    .page-item {
      padding: 8px;

      &.active .page-link {
        font-weight: bold;
      }
    }
  }
}
</style>
