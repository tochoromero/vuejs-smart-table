# Filtering
Smart Table is not concerned with the UI elements you choose to present the filtering options. 
This way you can craft any UI for your users to interact with the filters 
and just let Smart Table take care of the actual filtering.


## Filters <Badge text="BasicFilter | CustomFilter"/>
To enable filtering you need to provide the `filters` property on the `VTable` component.

```html{3}
<VTable
  :data="data"
  :filters="filters"
>
```

The `filters` object needs to be a reactive object where each property represents a filter, for example:

```js
data: () => ({
  filters: {
    name: { value: '', keys: ['name'] }
  }
})
```

The entry Key is just for you, so you can reference any of the filters by its name.
The entry value is what Smart Table will use to perform the actual filtering.

There two types of filters `BasicFilters` and `CustomFilters`

## Basic Filters <Badge text="BasicFilter"/>
Basic filters are very straight forward. These are the kind you will use the most. 

The typescript definition for a Basic Filter is:

```ts
interface BasicFilter {
  value: string
  keys: string[]
  exact?: boolean
}
```

### value <Badge text="string" type="tip"/>
This is the filter string, this is the string we will match against. 

You would normally bind it to the `v-model` of an input element. As you type,
the rows will be filtered. Keep in mind that an empty `value` means there is no filter.

### keys <Badge text="string[]" type="tip"/>
This is an Array of Strings indicating what fields of each row the filter `value` will apply to.

You must provide at least one key. If more than one key is provided as long as one of the row fields matches the filter,
the row will be displayed.

### exact <Badge text="boolean" type="tip"/> <Badge text="optional" type="tip"/>
By default, a row will be displayed if the filter `value` is contained on any of the specified `keys`.
On top of that by default the string are converted to lowercase before compared.

However, sometimes you do want it to be an exact match, 
for those cases set `exact` to `true` and the comparison will be performed with `===`.

#### Example

<CodeGroup>
  <CodeGroupItem title="html" active>

```html{7}
<template>
  <label>Filter by Name:</label>
  <input v-model="filters.name.value"/>

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
</template>
```
  </CodeGroupItem>
  <CodeGroupItem title="js">

```js
import users from './users.json'

export default {
    name: 'BasicFiltering',
    data: () => ({
        users,
        filters: {
          name: { value: '', keys: ['name'] }
        }
    })
}
```
  </CodeGroupItem>

</CodeGroup>

#### Result

<BasicFiltering/>

## Custom Filters <Badge text="CustomFilter"/>
You also have the option to provide a custom filter for more complex situations. 
A Custom Filter is a function with two arguments: The filter `value` and the current `row`.
It should return `true` if the row should be displayed and `false` otherwise.

Unlike Basic Filters where the filter `value` must be a `string` with Custom Filters the filter `value` can be anything,
you are in control of it.

The typescript definition for custom filter is:

```ts
interface CustomFilter {
  value?: unknown;
  custom: (value: any, row: Record<string, any>) => boolean;
}
```
### value <Badge text="Any" type="success"/>
The same as with Basic Filters, the `value` is what you will use to match against, but unlike Basic Filters this `value` is not limited to
`strings`, it can be anything. This `value` will be the first argument of your custom function.

Again, just as with Basic Filters, the `value` is what your will bind to a `v-model` but now you are not limited to just text inputs.

### custom <Badge text="CustomFilterFunction" type="info"/>
This is the custom filtering function. Its typescript definition is:

```ts
type CustomFilterFunction =
  (value: any, row: Record<string, any>) => boolean
```

The `value` parameter is the filter value, you will compare it to your rows. This `value` is the same `value` we specified above.

The `row` parameter represent a row in your table, you will compare your `value` against this `row`.

The function must return a `boolean`. If `true` it means the row should be displayed, if `false` the row will not be displayed.

#### Example

<CodeGroup>

  <CodeGroupItem title="html" active>

```html{5,15,23}
<label class="form-label">Min Age:</label>
<input
  class="form-input"
  type="number"
  v-model.number="filters.age.value.min"
  :min="0"
  :max="filters.age.value.max"
  @onKeyDown.prevent="() => {}"
/>

<label class="form-label">Max Age:</label>
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
```
  </CodeGroupItem>

<CodeGroupItem title="js">

```js{9-11,14-17}
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
```
</CodeGroupItem>

</CodeGroup>

::: tip
Notice how we have two inputs controlling the filter values. The `ageFilter` custom filter receives both of those values
and verify the row to make sure its age is between them.
:::

#### Result

<CustomFiltering />
