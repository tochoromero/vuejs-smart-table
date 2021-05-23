# Pagination

Smart Table supports client side pagination.
To enable it, you need to provide the `pageSize` and `currentPage` properties on the `VTable` Component.

```html
<VTable
  :data="users"
  :pageSize="10"
  :currentPage.sync="currentPage"
>
  ...
</VTable>
```

## Page Size  <Badge text="number"/>
The `pageSize` property specify the amount of items each page should contain.
If this property is present, client side pagination will be enabled.

## Current Page <Badge text="number"/>
The `currentPage` property indicates the current active page.
This property must be bound with a `sync` modifier for Vue 2 and with `v-model:currentPage` for Vue 3, since the `VTable` itself
may update its value, e.g. if a new filter is applied, and the amount of available items decreases,
and the current active page is no longer valid.

::: tip
The `currentPage` property index starts at `1`,
this is to avoid confusion since visually the page links start at `1` not `0`.
:::

## Total Pages Changed  <Badge text="number"/>
The total amount of pages is calculated using the total amount of items and the provided page size.
As these values change, the amount of pages will also change and a `totalPagesChanged` event
will be emitted with the new amount as its payload.

## Total Items Changed  <Badge text="number"/>
The total amount of items changes as the Filters change. When it changes `VTable` will emit a `totalItemsChanged` Event.
This event will also be emitted when the `VTable` mounts, so you will have the right amount from the start.

## Pagination Controls
The pagination controls are handled outside of `VTable`, you can use whatever you want to control it, but we provide
a `VTPagination` component, so you can have everything you need out the box.

The component requires the following properties:

### Current Page <Badge text="number"/>
This should be the same `currentPage` property used for the `VTable` component,
and it should also be bound with the `sync` modifier for Vue or `v-model:currentPage` for Vue 3, 
that way whenever either of them changes it the other will be notified.

## Example

<CodeGroup>
  <CodeGroupItem title="vue 3" active>

 ```html
 <template>
  <div>
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
    />
  </div>
</template>
 ```
  </CodeGroupItem>

  <CodeGroupItem title="vue 2">

 ```html
 <template>
  <div>
    <VTable
      :data="users"
      :page-size="5"
      currentPage.sync="currentPage"
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
      currentPage.sync="currentPage"
      :total-pages="totalPages"
    />
  </div>
</template>
 ```
  </CodeGroupItem>

<CodeGroupItem title="js">

 ```js
 <script>
  import users from './users.json'

  export default {
    data: () => ({
      users: users,
      totalPages: 1,
      currentPage: 1
})
}
</script>
```
</CodeGroupItem>
</CodeGroup>

<Pagination/>

## VTPagination Properties
Besides the `currentPage` and `totalPages` properties, there are many others used to configure the behaviour and look
and feel of the pagination controls:

| Property      | Type | Description | Default |
| ----------- | ----------- | ----------- | ----------- |
| hideSinglePage      | boolean       | Hide pagination controls when there is only a single page. | `true`
| maxPageLinks   | number        | Maximum number of page links visibles, if omitted we will show all page links. | `undefined`
| boundaryLinks | boolean | Show links to navigate to the first and last page | `false`
| firstText | string | Text for the first page link | `'First'`
| lastText | string | Text for the last page link | `'Last'`
| directionLinks | boolean | Show direction links to navigate back and forth between pages | `true`


## CSS Customization
The HTML structure for the Smart Pagination component is as follows:
```html
<nav class="vt-pagination">
    <ul class="pagination">
       <li class="page-item active">
         <a class="page-link">1</a>
       </li>
       <li class="page-item">
         <a class="page-link">2</a>
       </li>
       <li class="page-item">
         <a class="page-link">3</a>
       </li>
       </li>
    </ul>
</nav>
```
This structure is compatible with Bootstrap's Pagination. But you can easily customize it with your own Styles.
