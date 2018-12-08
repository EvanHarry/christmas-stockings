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
          <v-toolbar-title>Stock</v-toolbar-title>
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
              <edit-item
                :fields="fields"
                :item="props.item"
                :refresh="updateItem"
                :remove-item="removeItem"
                title="Stock"
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
          <v-toolbar-title>Search</v-toolbar-title>
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
    <v-snackbar
      v-model="alert.value"
      bottom
      color="grey darken-3"
    >
      <span>{{ alert.msg }}</span>
      <v-btn
        color="white"
        flat
        icon
        @click="alert.value = false"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
    <new-item
      :fields="fields"
      :save-item="createItem"
      title="stock"
    />
  </v-layout>
</template>

<script>
import EditItem from '@/components/EditItem'
import NewItem from '@/components/NewItem'

export default {
  name: 'home',
  components: {
    EditItem,
    NewItem
  },
  data () {
    return {
      alert: {
        msg: '',
        value: false
      },
      fields: [
        { label: 'Supplier Code', placeholder: '#####', rules: ['required'], value: 'supplier_code', text: true },
        { label: 'Tidings Code', placeholder: '#####', rules: ['required'], value: 'tidings_code', text: true },
        { label: 'Supplier', placeholder: '#####', rules: ['required'], value: 'supplier', text: true },
        { label: 'Location', placeholder: '#####', rules: ['required'], value: 'location', text: true },
        { label: 'Quantity', placeholder: '#####', rules: ['number', 'required'], value: 'quantity', text: true }
      ],
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
    async createItem (item) {
      try {
        let quantity = parseInt(item.quantity)

        await this.$axios.post('/stock/', { ...item, quantity: quantity })

        this.alert = {
          msg: 'Created stock item.',
          value: true
        }

        await this.getSuppliers()
      } catch (e) {
        throw new Error()
      }
    },
    async removeItem (id) {
      try {
        await this.$axios.delete(`/stock/${id}/`)

        let i = this.items
          .findIndex(m => m.id === id)

        this.items.splice(i, 1)
      } catch (e) {
        this.alert = {
          msg: 'Error deleting stock item.',
          value: true
        }

        throw new Error()
      }
    },
    async updateItem (item) {
      try {
        let quantity = parseInt(item.quantity)

        const { data } = await this.$axios.put(`/stock/${item.id}/`, { ...item, quantity: quantity })

        let i = this.items
          .findIndex(m => m.id === item.id)

        this.items.splice(i, 1)
        this.items.push(data)
      } catch (e) {
        this.alert = {
          msg: 'Error updating stock item.',
          value: true
        }

        throw new Error()
      }
    }
  }
}
</script>
