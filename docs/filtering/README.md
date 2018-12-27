# Filtering
Smart Table is only on charge of the actual row filtering based on the provided configuration. 
The visual aspect of it are in your control, allowing you to use any UI Elements to interact while it frees you
from the actual filtering computation.

## Filters <Badge text="Property"/> <Badge text="filters: Object"/>
To enable filtering you need to provide the `filters` property on the `v-table` component.

The `filters` configuration object has the following form:

```js
{
  name: {value: '', keys: ['name']}
}
```

The entry Key is just for you, so you can reference any of the filters by its name. 
It is the entry Value Object what Smart Table will use to perform the filtering.

### value <Badge text="String" type="success"/>
This String is the value of the filter, you would normally bind it to the `v-model` of an input element. As you type,
the rows will be filtered.

Keep in mind that an empty `value` means there is no filter.

### keys <Badge text="Array" type="success"/>
This is an Array of Strings indicating what fields of each row the filter `value` will apply to.

You must provide at least one key. If more than one key is provided as long as one of the row fields matches the filter,
the row will be displayed.

#### Example
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

```html
<template>
    <div>
      <label>Filter by Name:</label>
      <input class="form-control" v-model="filters.name.value"/>
    
      <v-table
        :data="users"
        :filters="filters"
      >
        <thead slot="head">
        <th>Name</th>
        <th>Age</th>
        <th>Email</th>
        <th>Address</th>
        </thead>
        <tbody slot="body" slot-scope="{displayData}">
        <tr v-for="row in displayData" :key="row.guid">
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
          <td>{{ row.email }}</td>
          <td>
              {{ row.address.street }}, 
              {{ row.address.city }} 
              {{ row.address.state}}
          </td>
        </tr>
        </tbody>
      </v-table>
    </div>
</template>
```

<BasicFiltering/>

## Custom Filters
You also have the option to provide a custom filter for more complex situations. 
A Custom Filter is a function with two arguments: `filterValue` and `row`.
It should return `true` if the row should be displayed and `false` otherwise.

### custom <Badge text="Function" type="success"/>
To use a custom filter provide the filtering function on the `custom` property on the filter configuration object:

### value <Badge text="Any" type="success"/>
With custom filtering the `value` property is not limited to Strings, you can provide anything as the `value`, 
it will just get passed along to your custom function.

#### Example
```js
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

```html
<template>
    <div>
      <label>Min Age:</label>
    
      <InputSpinner
        v-model="filters.age.value.min"
        :min="0"
        :max="filters.age.value.max"
      />
    
      <label>Max Age:</label>
      <InputSpinner
        v-model="filters.age.value.max"
        :min="filters.age.value.min"
        :max="99"
      />
    
      <v-table
        :data="users"
        :filters="filters"
      >
        <thead slot="head">
        <th>Name</th>
        <th>Age</th>
        <th>Email</th>
        <th>Address</th>
        </thead>
        <tbody slot="body" slot-scope="{displayData}">
        <tr v-for="row in displayData" :key="row.guid">
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
          <td>{{ row.email }}</td>
          <td>
            {{ row.address.street }},
            {{ row.address.city }}
            {{ row.address.state}}
          </td>
        </tr>
        </tbody>
      </v-table>
    </div>
</template>
```
::: tip
Please think of the `InputSpinner` as a fancy `Input` with validation. The important bit is its `v-model`.
:::

<CustomFiltering/>
