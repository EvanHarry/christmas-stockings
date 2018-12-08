<template>
  <v-dialog
    v-model="active"
    persistent
    width="400"
  >
    <v-btn
      slot="activator"
      bottom
      color="purple darken-3 white--text"
      fab
      fixed
      right
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-card>
      <v-toolbar
        card
        color="green darken-3"
        dark
        dense
      >
        <v-toolbar-title>New Stock</v-toolbar-title>
      </v-toolbar>
      <v-form
        ref="form"
        v-model="valid"
        @submit="save"
      >
        <v-card-text>
          <v-text-field
            v-for="(item, i) in items"
            v-model="newItem[item.value]"
            :key="i"
            :label="item.label"
            :placeholder="item.placeholder"
            :rules="getRules(item.rules)"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="loading || !valid"
            :loading="loading"
            block
            color="purple white--text"
            depressed
            type="submit"
          >
            <span>Save</span>
          </v-btn>
          <v-btn
            :disabled="loading"
            block
            color="red white--text"
            depressed
            @click="active = false"
          >
            <span>Cancel</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'new-stock',
  props: {
    refresh: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      active: false,
      items: [
        { label: 'Supplier Code', placeholder: '#####', rules: ['required'], value: 'supplier_code' },
        { label: 'Tidings Code', placeholder: '#####', rules: ['required'], value: 'tidings_code' },
        { label: 'Supplier', placeholder: '#####', rules: ['required'], value: 'supplier' },
        { label: 'Location', placeholder: '#####', rules: ['required'], value: 'location' },
        { label: 'Quantity', placeholder: '#####', rules: ['number', 'required'], value: 'quantity' }
      ],
      loading: false,
      newItem: {},
      valid: false
    }
  },
  watch: {
    active () {
      this.newItem = {}
      this.$refs.form.reset()
    }
  },
  methods: {
    getRules (item) {
      const rules = [
        {
          name: 'required',
          func: value => {
            return !!value || 'Required.'
          }
        },
        {
          name: 'number',
          func: value => {
            return !isNaN(value) || 'Must be a number.'
          }
        },
        {
          name: 'email',
          func: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        }
      ]

      return rules
        .filter(m => item.includes(m.name))
        .map(m => m.func)
    },
    async save () {
      this.loading = true

      let quantity = parseInt(this.newItem.quantity)

      await this.$axios.post('/stock/', { ...this.newItem, quantity: quantity })
      await this.wait(5000)

      this.loading = false
      this.active = false
      this.refresh()
    },
    async wait (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
      })
    }
  }
}
</script>
