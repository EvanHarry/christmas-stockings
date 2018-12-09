<template>
  <v-layout justify-center>
    <v-flex
      class="pr-1"
      hidden-sm-and-down
      md8
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
          <v-toolbar-title
            v-if="stockCount"
            class="body-2"
          >Total Items - {{ stockCount }}</v-toolbar-title>
          <v-progress-circular
            v-else
            indeterminate
            size="28"
          />
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
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="load"
        >
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
              :hide-details="valid"
              :rules="getRules(['url-safe'])"
              clearable
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
              :disabled="loading || !searchValid || !valid"
              :loading="loading"
              block
              color="purple white--text"
              depressed
              type="submit"
            >
              <span>Make it snow</span>
              <span slot="loader">Hold on for deer life</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
    <v-flex
      hidden-md-and-up
      sm8
      xs12
    >
      <v-card
        raised
      >
        <v-toolbar
          card
          color="red darken-3"
          dark
          dense
        >
          <v-toolbar-title>Stock</v-toolbar-title>
          <v-spacer />
          <v-toolbar-title
            v-if="stockCount"
            class="body-2"
          >Total Items - {{ stockCount }}</v-toolbar-title>
          <v-progress-circular
            v-else
            indeterminate
            size="28"
          />
        </v-toolbar>
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="load"
        >
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
              :hide-details="valid"
              :rules="getRules(['url-safe'])"
              clearable
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
              :disabled="loading || !searchValid || !valid"
              :loading="loading"
              block
              color="purple white--text"
              depressed
              type="submit"
            >
              <span>Make it snow</span>
              <span slot="loader">Hold on for deer life</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
      <v-card
        class="mt-2"
        raised
      >
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
          <v-list
            dense
            slot="item"
            slot-scope="props"
          >
            <v-list-tile>
              <v-list-tile-content class="body-2">Stock Item</v-list-tile-content>
              <edit-item
                :fields="fields"
                :item="props.item"
                :refresh="updateItem"
                :remove-item="removeItem"
                title="Stock"
              />
            </v-list-tile>
            <v-divider />
            <v-list-tile
              v-for="(item, i) in headers"
              :key="i"
            >
              <v-list-tile-content>{{ item.text }}:</v-list-tile-content>
              <span class="text-xs-right">{{ props.item[item.value] }}</span>
            </v-list-tile>
          </v-list>
        </v-data-iterator>
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
      title="Stock"
    />
  </v-layout>
</template>

<script>
import EditItem from '@/components/EditItem'
import NewItem from '@/components/NewItem'
import item from '@/mixins/item'

export default {
  name: 'home',
  components: {
    EditItem,
    NewItem
  },
  mixins: [
    item
  ],
  data () {
    return {
      alert: {
        msg: '',
        value: false
      },
      fields: [
        { label: 'Last Modified', placeholder: '#####', rules: [], value: 'last_modified', text: true, disabled: true },
        { label: 'Supplier Code', placeholder: '#####', rules: ['url-safe'], value: 'supplier_code', text: true },
        { label: 'Tidings Code', placeholder: '#####', rules: ['url-safe'], value: 'tidings_code', text: true },
        { label: 'Supplier', placeholder: '#####', rules: ['required', 'url-safe'], value: 'supplier', text: true },
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
      stockCount: '',
      suppliers: [],
      valid: false
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
  async mounted () {
    await this.getSuppliers()
    await this.getStockCount()
  },
  methods: {
    async getSuppliers () {
      const { data } = await this.$axios.get('/suppliers/')

      this.suppliers = data
    },
    async getStockCount () {
      const { data } = await this.$axios.get('/stock/statistics/')
      this.stockCount = data.count
    },
    async load () {
      this.loading = true

      let category = this.searchCategory
      let text = category === 'supplier' ? this.searchSupplier : this.searchText

      try {
        const { data } = await this.$axios.get(`/search/${category}/${encodeURIComponent(text)}/`)
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

        this.getSuppliers()
        this.getStockCount()
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

        this.getSuppliers()
        this.getStockCount()
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
