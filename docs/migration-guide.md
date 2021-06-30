# Migration Guide

The new version of Smart Table was rewritten in Typescript, but for the most part the core concepts where kept the same.
This guide will help you migrate an existing table to the new version.

## Renamed components
When you install Smart Table in your Vue application we register several components,
these components where renamed to better follow Vue style:

- `<v-table>` was renamed to `<VTable>`
- `<v-th>` was renamed to `<VTh>`
- `<v-tr>` was renamed to `<VTr>`
- `<smart-pagination>` was renamed to `<VTPagination>`

## Slots
### Head
The `head` slot now provides the `<thead>` wrapper, you no longer need to provide it.

**Before:**
```html
<v-table>
  <template #head>
    <thead>
    ...
    </thead>
  </template>
</v-table>
```

**After:**
```html
<VTable>
  <template #head>
    ...
  </template>
</VTable>
```

### Body
The `body` scoped slot now provides the `<tbody>` wrapper, you no longer need to provide it. 

In addition to that, the scoped variable it provides was renamed from `displayData` to `rows`.

**Before:**
```html
<v-table>
  <template #body="{ displayData }">
    <tbody>
    ...
    </tbody>
  </template>
  
</v-table>
```

**After:**
```html
<VTable>
  <template #body="{ rows }">
    ...
  </template>
</VTable>
```

## Custom Sort
In the previous version to have custom sort you provide a sort function that received two parameters, 
this is the two rows being compared.

This custom function needed to return `1` if the first row is greater, `0` if they are the same or `-1` if the second row is greater.
Internally we took return value of the custom function and multiplied it by the sort order, 
which will be either `1` or `-1`. This way the column will be sorted correctly.

Multiplying by the sort order automatically was a mistake, because it removes flexibility, 
for instance if you want to always have certain rows at the top or at the bottom.

Because of this the new custom sort function receives a third parameter `sortOrder` 
which can be `1` for ascending, `0` for not sorted and `-1` for descending.
Additionally, we no longer automatically multiply the return value of the function by the sort order, 
it is up to the custom sort implementation to take into account the `sortOrder` on its return value.

**Before:**
```js
dateSort(a, b) {
    let date1 = new Date(a.registered).getTime()
    let date2 = new Date(b.registered).getTime()

    return date1 - date2
}
```
**After:**
```js
dateSort(a, b, sortOrder) {
    let date1 = new Date(a.registered).getTime()
    let date2 = new Date(b.registered).getTime()

    return (date1 - date2) * sortOrder
}
```

You can learn more about custom sorting [here](/sorting.md#custom-sort).

## Custom Sort Icons
In the previous version, to use custom sort icons you would have to rely on CSS selectors to provide your icons.
This is no longer the case, instead we now have a scoped slot in the `<VTh>` component you can use to provide custom sort icons:

**Before:**
```css
.vt-sort:before{
    font-family: FontAwesome;
    padding-right: 0.5em;
    width: 1.28571429em;
    display: inline-block;
    text-align: center;
}

.vt-sortable:before{
    content: "\f0dc";
}

.vt-asc:before{
    content: "\f160";
}

.vt-desc:before{
    content: "\f161";
}
```

**After:**
```html
<VTh sortKey="name" #default="{ sortOrder }">
  Name
  <i 
    class="fas" 
    :class="{ 
       'fa-sort': sortOrder === 0, 
       'fa-up': sortOrder === 1, 
       'fa-down': sortOrder === -1, 
    }"
  />
</VTh>
```

## Selection Changed Event
There is no longer a `selectionChanged` event emitted when the selected rows change, 
instead the selected rows can be retrieved from the table state provided with the new `stateChanged` event.

**Before:**
```html
<v-table
  @selectionChanged="selectedRows = $event"
>
  ...
</v-table>
```

**After:**
```html
<VTable
  @stateChanged="selectedRows = $event.selectedRows"
>
  ...
</VTable>
```

## Pagination Boundary Links
In the previous version, the pagination boundary links were just text with the `First` and `Last` words.
In the new version they are an icon and, you cannot longer provide the `firstText` and `lastText` properties, instead you
will use two slots to provide either your text or your custom icon.

**Before:**
```html
<smart-pagination
  first-text="Go to first"
  last-text="Go to last"
>
  
</smart-pagination>
```

**After:**
```html
<VTPagination>
  <template #firstPage>
    Go to first
  </template>
  
  <template #lastPage>
    Go to last
  </template>
</VTPagination>
```
