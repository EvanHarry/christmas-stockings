<template>
  <v-layout justify-center>
    <v-flex class="pr-1" xs8>
      <v-card raised>
        <v-toolbar card color="red darken-3" dark dense>
          <v-toolbar-title>Search Results</v-toolbar-title>
        </v-toolbar>
        <v-data-table :headers="headers" :items="items" />
      </v-card>
    </v-flex>
    <v-flex class="pl-1" xs4>
      <v-card raised>
        <v-toolbar card color="indigo darken-3" dark dense>
          <v-toolbar-title>Home</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-select v-model="searchCategory" :items="searchItems" label="Search Category" placeholder="None" />
          <v-text-field v-if="searchCode" v-model="searchText" :disabled="!searchCategory" clearable hide-details label="Search Text" placeholder="Search item..." />
          <v-select v-else v-model="searchSupplier" :items="suppliers" clearable hide-details label="Search Supplier" placeholder="Search item..." />
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="loading || !searchValid" :loading="loading" block color="purple white--text" depressed @click="load">
            <span>Make it snow</span>
            <span slot="loader">Hold on for deer life</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      headers: [
        { text: 'Supplier Code', value: 'supplier_code', sortable: true },
        { text: 'Tidings Code', value: 'tidings_code', sortable: true },
        { text: 'Supplier', value: 'supplier', sortable: true },
        { text: 'Location', value: 'location', sortable: true },
        { text: 'Quantity', value: 'quantity', sortable: true }
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
  methods: {
    async load () {
      this.loading = true

      setTimeout(() => { this.loading = false }, 3000)
    }
  }
}
</script>
