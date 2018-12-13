<template>
  <v-form
    ref="form"
    @submit.prevent="load(searchCategory, searchText)"
  >
    <v-card-text>
      <v-select
        v-model="searchCategory"
        :items="headers"
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
        v-model="searchText"
        :items="searchCategory === 'supplier' ? suppliers : locations"
        hide-details
        label="Search Text"
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
        type="submit"
      >
        <span>Make it snow</span>
        <span slot="loader">Hold on for deer life</span>
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
export default {
  name: 'search',
  props: {
    headers: {
      type: Array,
      required: true
    },
    locations: {
      type: Array,
      required: true
    },
    load: {
      type: Function,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    suppliers: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      searchCategory: null,
      searchText: null
    }
  },
  computed: {
    searchCode () {
      let category = this.headers
        .find(m => m.value === this.searchCategory)

      return category ? category.type === 'text' : true
    },
    searchValid () {
      return this.searchText
    }
  },
  watch: {
    searchCategory () {
      this.searchText = null
    }
  }
}
</script>
