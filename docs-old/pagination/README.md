# Pagination

Vue Smart Table supports client side pagination. 
To enable it, you need to provide the `pageSize` and `currentPage` properties on the `v-table` Component.

## Page Size  <Badge text="Property"/> <Badge text="pageSize: Number"/>
The `pageSize` property specify the amount of items each page should contain. 
If this property is present, client side pagination will be enabled.

## Current Page <Badge text="Property"/> <Badge text="currentPage: Number"/>  <Badge text="Sync"/>
The `currentPage` property indicates the current active page. 
This property should be bound with a `sync` modifier, since the `v-table` itself 
may update its value, e.g. if a new filter is applied and the amount of available items decreases 
so the current active page is no longer valid.
::: tip
The `currentPage` property index starts at `1`, 
this is to avoid confusion since visually the page links start at `1` not `0`.
:::

## Total pages  <Badge text="Event"/> <Badge text="totalPagesChanged: Number"/>
The total amount of pages is calculated using the Total Items and the Page Size. 
As the Total Items changes the Total Pages will also change and a `totalPagesChanged` event 
will be emitted with the new amount as its payload.

## Total Items  <Badge text="Event"/> <Badge text="totalItemsChanged: Number"/>
The total amount of items changes as the Filters change. When it changes `v-table` will emit a `totalItemsChanged` Event.
This event will also be emitted when the `v-table` mounts so it will have the right amount from the start.

## Pagination Controls
The pagination controls are handled outside of `v-table`, you can use whatever you want to control it, but we provide
a `SmartPagination` component so you can have it working out of the box.

The component requires the following properties:

### Current Page <Badge text="Property"/> <Badge text="currentPage: Number"/>  <Badge text="Sync"/>
This should be the same `currentPage` property used for the `v-table` component 
and it should also use the `sync` modifier, that way whenever either of them changes it the other one will be notified.

### Total Pages <Badge text="Property"/> <Badge text="totalPages: Number"/>
The `v-table` component emits a `totalPagesChanged` event, when the event happens we should save the event payload and
use it for the `totalPages` property on the `SmartPagination` component.

## Example
```html
<template>
    <div>
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
</template>
```

```js
<script>
import users from './users.json'

export default {
  name: 'Pagination',
  data: () => ({
    users,
    currentPage: 1,
    totalPages: 0
  })
}
</script>
```
<Pagination/>

## Customizing Smart Pagination
Besides the `currentPage` and `totalPages` properties, there are many others used to configure the behaviour and look
and feel of the pagination controls.

### Hide Single Page <Badge text="Property"/> <Badge text="hideSinglePage: Boolean"/> <Badge text="default: true"/>
Determines whether or not we show the pagination controls when there is only a single page.

### Max Page Links <Badge text="Property"/> <Badge text="maxPageLinks: Number"/>
By default we will show every single page link, but you can use the `maxPageLinks` property to limit the amount of visible links.

### Boundary Links <Badge text="Property"/> <Badge text="boundaryLinks: Boolean"/> <Badge text="default: false"/>
Determines whether or not we should show two links to navigate to the First and Last page.

### First Text <Badge text="Property"/> <Badge text="firstText: String"/> <Badge text="default: First"/>
Specify the text for the First Page link.

### Last Text <Badge text="Property"/> <Badge text="lastText: String"/> <Badge text="default: Last"/>
Specify the text for the Last Page link.

### Direction Links <Badge text="Property"/> <Badge text="hideSinglePage: Boolean"/> <Badge text="default: true"/>
Determines whether or not we should have direction links to navigate back and forth between pages.

### CSS Customization
The HTML structure for the Smart Pagination component is as follows:
```html
<nav class="smart-pagination">
    <ul class="pagination">
       <li class="page-item">
         <a class="page-link">1</a>
         <a class="page-link">2</a>
         <a class="page-link">3</a>
       </li>
    </ul>
</nav>
```
This structure is compatible with Bootstrap's Pagination. But you can easily customize it with your own Styles.
