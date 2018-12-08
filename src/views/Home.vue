<template>
  <v-layout justify-center>
    <v-flex
      class="pr-1"
      xs8
    >
      <v-card raised>
        <v-toolbar
          card
          color="red darken-3"
          dark
          dense
        >
          <v-toolbar-title>Results</v-toolbar-title>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="items"
          :rows-per-page-items="[5]"
        >
          <template
            slot="items"
            slot-scope="props"
          >
            <td>{{ props.item.supplier_code }}</td>
            <td>{{ props.item.tidings_code }}</td>
            <td>{{ props.item.supplier }}</td>
            <td>{{ props.item.location }}</td>
            <td class="align-center layout pr-1">
              <span>{{ props.item.quantity }}</span>
              <v-spacer />
              <edit-stock
                :refresh="updateItem"
                :remove-item="removeItem"
                :stock="props.item"
              />
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-flex
      class="pl-1"
      xs4
    >
      <v-card raised>
        <v-toolbar
          card
          color="blue darken-3"
          dark
          dense
        >
          <v-toolbar-title>Stock</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-select
            v-model="searchCategory"
            :items="searchItems"
            label="Search Category"
            placeholder="None"
          />
          <v-text-field
            v-if="searchCode"
            v-model="searchText"
            :disabled="!searchCategory"
            clearable
            hide-details
            label="Search Text"
            placeholder="Search item..."
          />
          <v-select
            v-else
            v-model="searchSupplier"
            :items="suppliers"
            hide-details
            label="Search Supplier"
            placeholder="Search item..."
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="loading || !searchValid"
            :loading="loading"
            block
            color="purple white--text"
            depressed
            @click="load"
          >
            <span>Make it snow</span>
            <span slot="loader">Hold on for deer life</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <new-stock :refresh="getSuppliers" />
  </v-layout>
</template>

<script>
import EditStock from '@/components/EditStock'
import NewStock from '@/components/NewStock'

export default {
  name: 'home',
  components: {
    EditStock,
    NewStock
  },
  data () {
    return {
      headers: [
        { text: 'Supplier Code', value: 'supplier_code', sortable: true },
        { text: 'Tidings Code', value: 'tidings_code', sortable: true },
        { text: 'Supplier', value: 'supplier', sortable: true },
        { text: 'Location', value: 'location', sortable: true },
        { text: 'Quantity', value: 'quantity', sortable: true, width: 100 }
      ],
      items: [],
      loading: false,
      searchCategory: null,
      searchItems: [
        { text: 'Supplier Code', value: 'supplier_code' },
        { text: 'Tidings Code', value: 'tidings_code' },
        { text: 'Supplier', value: 'supplier' }
      ],
      searchSupplier: '',
      searchText: '',
      suppliers: []
    }
  },
  computed: {
    searchCode () {
      return this.searchCategory ? this.searchCategory !== 'supplier' : true
    },
    searchValid () {
      return this.searchSupplier || this.searchText
    }
  },
  watch: {
    searchCategory () {
      this.searchSupplier = null
      this.searchText = ''
    }
  },
  mounted () {
    this.getSuppliers()
  },
  methods: {
    async getSuppliers () {
      const { data } = await this.$axios.get('/suppliers/')

      this.suppliers = data
    },
    async load () {
      this.loading = true

      let category = this.searchCategory
      let text = category === 'supplier' ? this.searchSupplier : this.searchText

      const { data } = await this.$axios.get(`/search/${category}/${text}/`)
      this.items = data

      this.loading = false
    },
    removeItem (id) {
      let i = this.items
        .findIndex(m => m.id === id)

      this.items.splice(i, 1)
    },
    updateItem (item) {
      let id = item.id
      let i = this.items
        .findIndex(m => m.id === id)

      this.items.splice(i, 1)
      this.items.push(item)
    }
  }
}
</script>
