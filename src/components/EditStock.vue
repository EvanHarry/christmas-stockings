<template>
  <v-dialog
    v-model="active"
    persistent
    width="400"
  >
    <v-btn
      slot="activator"
      color="green"
      flat
      icon
      small
    >
      <v-icon small>edit</v-icon>
    </v-btn>
    <v-card>
      <v-toolbar
        card
        color="green darken-3"
        dark
        dense
      >
        <v-toolbar-title>Edit Stock</v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          @click="remove"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form
        ref="form"
        v-model="valid"
        @submit="update"
      >
        <v-card-text>
          <v-text-field
            v-for="(item, i) in items"
            v-model="editItem[item.value]"
            :key="i"
            :label="item.label"
            :placeholder="item.placeholder"
            :rules="$data[item.rules]"
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
  name: 'edit-stock',
  props: {
    refresh: {
      type: Function,
      required: true
    },
    removeItem: {
      type: Function,
      required: true
    },
    stock: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      active: false,
      items: [
        { label: 'Supplier Code', placeholder: '#####', rules: 'textRules', value: 'supplier_code' },
        { label: 'Tidings Code', placeholder: '#####', rules: 'textRules', value: 'tidings_code' },
        { label: 'Supplier', placeholder: '#####', rules: 'textRules', value: 'supplier' },
        { label: 'Location', placeholder: '#####', rules: 'textRules', value: 'location' },
        { label: 'Quantity', placeholder: '#####', rules: 'numberRules', value: 'quantity' }
      ],
      loading: false,
      editItem: {},
      numberRules: [
        value => !!value || 'Required.',
        value => !isNaN(value) || 'Must be a number.'
      ],
      textRules: [
        value => !!value || 'Required.'
      ],
      valid: false
    }
  },
  watch: {
    active () {
      this.editItem = JSON.parse(JSON.stringify(this.stock))
    }
  },
  methods: {
    async remove () {
      this.loading = true
      let id = this.stock.id

      await this.$axios.delete(`/stock/${id}/`)

      this.loading = true
      this.active = false
      this.removeItem(id)
    },
    async update () {
      this.loading = true
      let id = this.stock.id
      let quantity = parseInt(this.editItem.quantity)

      const { data } = await this.$axios.put(`/stock/${id}/`, { ...this.editItem, quantity: quantity })

      this.loading = false
      this.active = false
      this.refresh(data)
    }
  }
}
</script>
