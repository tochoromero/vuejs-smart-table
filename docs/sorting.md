# Sorting

To enable column sorting, instead of using vanilla `th` elements we will use `VTh` components for the columns
we want to provide sorting.

## Table Header <Badge text="VTh"/>
The `VTh` component renders to a regular `th` element, but it allows you to sort the table, it has three properties:
`sortKey`, `customSort` and `defaultSort`.

### Sort Key <Badge text="string | function"/>
The `sortKey` property is used to get to specify the value within a row we will use to sort it. It can be a `string` 
or a `function`.

#### String
As a `string`, it represents the path to the property in the row we want to sort. You can even use nested paths.
```html
<template #head>
    <VTh sortKey="name">Name</VTh>
    <VTh sortKey="address.state">State</VTh>
</template>
```

#### Function
Sometimes you may want the sort value to be a computed value, for instance `firstName` + `lastName` or the length of a field.

For those cases you can use a `function` instead, its typescript definition is:

```ts
type SortKey = (row: any, sortOrder: SortOrder) => any

enum SortOrder {
  DESC = -1,
  NONE = 0,
  ASC= 1
}
```

Notice how the function receives two arguments: 
- `row`: Is the full object that represents the current row.
- `sortOrder`: Is the current sorting direction. This is just extra information you can use when computing the sort value.

<CodeGroup>

  <CodeGroupItem title="html" active>

```html
<template #head>
    <VTh :sortKey="nameLength">Name</VTh>
</template>
```
  </CodeGroupItem>

  <CodeGroupItem title="js">

```js
methods: {
  nameLength (row) {
    return row.name.length
  }
}
```
  </CodeGroupItem>
</CodeGroup>

Once we have used the `sortKey` property to get the column values, we will proceed to compare them.

If the values are numbers, we will just compare them by subtraction.
Otherwise, we will call `toString()` on them and compare them with `localeCompare`.

### Custom Sort <Badge text="function"/>
In some cases you need more control over sorting, 
for instance if you have a complex object, or your sorting depends on two or more values. 
For those instances, instead of providing a `sortKey` property you can use the `customSort` property to provide a sorting function.
The custom sort function has the following definition:

```ts
type CustomSort = ((a: any, b: any, sortOrder: SortOrder) => number)

enum SortOrder {
  DESC = -1,
  NONE = 0,
  ASC= 1
}
```

The function will receive the 2 rows being compared, and a third parameter with the sort order.

The function needs to return  greater than `0` if the first row is greater, lower than `0` if the second row is greater 
or `0` if they are the same.


<CodeGroup>

  <CodeGroupItem title="html">

```html
<template #head>
    <VTh :customSort="dateSort">Registered at</VTh>
</template>
```
  </CodeGroupItem>

  <CodeGroupItem title="js" active>

```js active
methods: {
  dateSort(a, b, sortOrder) {
    let date1 = new Date(a.registered).getTime();
    let date2 = new Date(b.registered).getTime();
    
    if (sortOrder === 1) {
      return date1 - date2
    } else if (sortOrder === -1) {
      return date2 - date1
    } else {
      return 0
    }
  }
}
```
  </CodeGroupItem>
</CodeGroup>

### Default Sort <Badge text="'asc' | 'desc'"/>
You should provide this for the one column you want the table to be sorted by default. 
The possible values are: `asc` for ascending ordering and `desc` for descending order.

Only one `VTh` should have its `defaultSort` value set, if more than one have it, the last one will take precedence.

```html
<template #head>
    <VTh sortKey="name">Name</VTh>
    <VTh sortKey="age" defaultSort="desc">Age</VTh>
</template>
```

### Example


<CodeGroup>
  <CodeGroupItem title="html" active>

```html
<template>
    <VTable :data="users">
      <template #head>
        <VTh :sortKey="nameLength" defaultSort="desc">
          Name
        </VTh>
        <VTh sortKey="age">Age</VTh>
        <VTh sortKey="address.state">State</VTh>
        <VTh :customSort="dateSort">Registered at</VTh>
      </template>
      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.guid">
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
          <td>{{ row.address.state }}</td>
          <td>{{ row.registered }}</td>
        </tr>
      </template>
    </VTable>
</template>
```
  </CodeGroupItem>

  <CodeGroupItem title="js">

```js
<script>
import users from './users.json'

export default {
  name: 'Sorting',
  data: () => ({
    users
  }),
  methods: {
    nameLength (row) {
      return row.name.length
    },
    dateSort(a, b) {
      let date1 = new Date(a.registered).getTime();
      let date2 = new Date(b.registered).getTime();
      
      return date1 - date2;
    }
  }
}
</script>
```
  </CodeGroupItem>
</CodeGroup>

<Sorting />

## Additional Settings
There some additional settings available for you at the `VTable` component, this will affect all the `VTh` inside that table.

### Sort Icon Position <Badge text="'before' | 'after'"/> <Badge text="Global"/>
Determines the position the default sort icon will be rendered. By default it is rendered after the column header text,
but it can be changed to be rendered before the column header text.

```html
<template #head>
  <VTable 
    :data="users"
    sortIconPosition="before"
  >
    <template #head>
      <VTh :sortKey="nameLength">
        Name
      </VTh>
      ...
  <VTable />    
</template>
```

### Sort Header Class <Badge text="string"/>
The `VTh` component gets rendered as a normal `th` element and it includes the `v-th` css class, 
this is enough to target it and style it.

But, with the popularity of tools like Tailwind CSS you may want to add utility classes to your headers, 
for those instances you can use the `sortHeaderClass` property on `VTable` to add additional classes to the `VTh` output.

```html
<VTable
    :data="users"
    :sortHeaderClass="flex items-center justify-between w-full"
>
  <template #head>
    <VTh :sortKey="nameLength">
      Name
    </VTh>
    ...
    <VTable />
</VTable>
```

The output of this table will be:

```html
<table class="v-table">
 <thead>
  <th class="v-th">
    <div class="flex items-center justify-between w-full">
      <span>Name</span>
      <svg>...</svg>
    </div>
  </th>
  ...
 </thead>
</table>
```


## Custom Sort Icons
By default, we include three SVG icons to indicate the sorting state of a column. 
This should be enough for basic examples, but you have the ability to provide your own sort icons.

### Hide Sort Icons <Badge text="boolean"/> <Badge text="Global"/>
The first thing you need to do is to disable the default sort icons with the `hideSortIcons` property on the `VTable` component:

```html
<VTable
    :data="users"
    :hideSortIcons="true"
>
...
</VTable>
```

Then, the `VTh` component's default slot receives a `sortOrder` property you can use to include your custom sort icon.
For instance, if you were to use [FontAwesome](https://fontawesome.com/) icons it would look like this:

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

Remember, `SortOrder` is defined as:

```ts
enum SortOrder {
  DESC = -1,
  NONE = 0,
  ASC= 1
}
```

In practice, you don't want to repeat this over and over, 
so you will want to create a custom component that receives the `sortOrder` and renders the right icon.

## Sort Events

### Sort Changed
When the sort changes because the user clicks a header we will emit a `sortChanged` event. The event payload will
be an object with a `sortOrder` property whose value will be `-1` for descending or `1` for ascending.
