<template>
  <v-layout justify-center>
    <v-flex
      :class="$vuetify.breakpoint.mdAndUp ? 'pr-1' : ''"
      md8
      sm8
      xs12
    >
      <v-card raised>
        <v-toolbar
          card
          color="red darken-3"
          dark
          dense
        >
          <v-toolbar-title>Stock</v-toolbar-title>
          <v-spacer />
          <new-item
            :fields="fields"
            :save-item="createItem"
            title="Stock"
          />
        </v-toolbar>
        <search
          v-if="$vuetify.breakpoint.smAndDown"
          :headers="headers"
          :locations="locations"
          :load="load"
          :loading="loading"
          :suppliers="suppliers"
        />
        <v-data-table
          v-if="$vuetify.breakpoint.mdAndUp"
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
            <td>{{ getLastModified(props.item.last_modified) }}</td>
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
      <v-card
        v-if="$vuetify.breakpoint.smAndDown"
        class="mt-2"
        raised
      >
        <v-toolbar
          card
          color="blue darken-3"
          dark
          dense
        >
          <v-toolbar-title>Results</v-toolbar-title>
        </v-toolbar>
        <v-data-iterator
          :headers="headers"
          :items="items"
          :rows-per-page-items="[1]"
        >
          <template slot="no-data">
            <v-list dense>
              <v-list-tile>
                <v-list-tile-content>No data available</v-list-tile-content>
              </v-list-tile>
            </v-list>
          </template>
          <template
            slot="item"
            slot-scope="props"
          >
            <div class="layout">
              <span
                class="body-2 pl-3 py-2"
                style="align-self: center;"
              >Stock Item</span>
              <v-spacer />
              <edit-item
                :fields="fields"
                :item="props.item"
                :refresh="updateItem"
                :remove-item="removeItem"
                title="Stock"
              />
            </div>
            <v-list
              class="pt-0"
              dense
            >
              <v-divider />
              <v-list-tile
                v-for="(item, i) in headers"
                :key="i"
              >
                <v-list-tile-content>{{ item.text }}:</v-list-tile-content>
                <span class="text-xs-right">{{ props.item[item.value] }}</span>
              </v-list-tile>
            </v-list>
          </template>
          <template
            slot="pageText"
            slot-scope="props"
          >
            {{ props.pageStart }} of {{ props.itemsLength }}
          </template>
        </v-data-iterator>
      </v-card>
    </v-flex>
    <v-flex
      class="pl-1"
      hidden-sm-and-down
      md4
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
        <search
          :headers="headers"
          :locations="locations"
          :load="load"
          :loading="loading"
          :suppliers="suppliers"
        />
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
  </v-layout>
</template>

<script>
import EditItem from '@/components/EditItem'
import NewItem from '@/components/NewItem'
import Search from '@/components/Search'

export default {
  name: 'home',
  components: {
    EditItem,
    NewItem,
    Search
  },
  data () {
    return {
      alert: {
        msg: '',
        value: false
      },
      fields: [
        { label: 'Last Modified', placeholder: '#####', rules: [], value: 'last_modified', text: true, disabled: true },
        { label: 'Supplier Code', placeholder: '#####', rules: [], value: 'supplier_code', text: true },
        { label: 'Tidings Code', placeholder: '#####', rules: [], value: 'tidings_code', text: true },
        { label: 'Supplier', placeholder: '#####', rules: ['required'], value: 'supplier', text: true },
        { label: 'Location', placeholder: '#####', rules: ['required'], value: 'location', text: true },
        { label: 'Quantity', placeholder: '#####', rules: ['number', 'required'], value: 'quantity', text: true }
      ],
      headers: [
        { text: 'Supplier Code', value: 'supplier_code', sortable: true, type: 'text' },
        { text: 'Tidings Code', value: 'tidings_code', sortable: true, type: 'text' },
        { text: 'Supplier', value: 'supplier', sortable: true, type: 'select' },
        { text: 'Location', value: 'location', sortable: true, type: 'select' },
        { text: 'Last Modified', value: 'last_modified', sortable: true, type: 'date' },
        { text: 'Quantity', value: 'quantity', sortable: true, type: 'text', width: 100 }
      ],
      items: [],
      loading: false,
      locations: [],
      stockCount: null,
      stockEntries: null,
      suppliers: []
    }
  },
  mounted () {
    this.getLocations()
    this.getSuppliers()
    this.getStockCount()
  },
  methods: {
    getLastModified (str) {
      const splitStr = str.split(' - ')
      const dateStr = splitStr[0]
      const splitDate = dateStr.split(/[-/]+/)

      const day = parseInt(splitDate[0])
      const month = parseInt(splitDate[1]) - 1
      const year = parseInt(splitDate[2])

      return new Date(year, month, day).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    async getLocations () {
      const { data } = await this.$axios.get('/stock/locations/')

      this.locations = data
    },
    async getSuppliers () {
      const { data } = await this.$axios.get('/stock/suppliers/')

      this.suppliers = data
    },
    async getStockCount () {
      const { data } = await this.$axios.get('/stock/statistics/')

      this.stockCount = data.count
      this.stockEntries = data.entries
    },
    async load (category, text) {
      this.loading = true

      try {
        const { data } = await this.$axios.post('/search/', { category: category, search_text: text })
        this.items = data

        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async createItem (item) {
      try {
        let quantity = parseInt(item.quantity)

        await this.$axios.post('/stock/', { ...item, quantity: quantity })

        this.alert = {
          msg: 'Created stock item.',
          value: true
        }

        this.getLocations()
        this.getStockCount()
        this.getSuppliers()
      } catch (e) {
        this.alert = {
          msg: 'Error creating stock item.',
          value: true
        }

        throw new Error()
      }
    },
    async removeItem (id) {
      try {
        await this.$axios.delete(`/stock/${id}/`)

        this.alert = {
          msg: 'Deleted stock item.',
          value: true
        }

        let i = this.items
          .findIndex(m => m.id === id)

        this.items.splice(i, 1)

        this.getLocations()
        this.getStockCount()
        this.getSuppliers()
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

        this.alert = {
          msg: 'Updated stock item.',
          value: true
        }

        let i = this.items
          .findIndex(m => m.id === item.id)

        this.items.splice(i, 1)
        this.items.push(data)

        this.getLocations()
        this.getStockCount()
        this.getSuppliers()
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
