<template>
  <v-dialog
    v-model="active"
    persistent
    width="400"
    style="margin: -6px;"
  >
    <v-btn
      slot="activator"
      class="mx-0"
      dark
      flat
      icon
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
        <v-toolbar-title>New {{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="save"
      >
        <v-card-text>
          <div
            v-for="(item, i) in fields"
            :key="i"
          >
            <v-text-field
              v-if="item.text"
              v-model="newItem[item.value]"
              :disabled="item.disabled"
              :label="item.label"
              :placeholder="item.placeholder"
              :rules="getRules(item.rules)"
            />
            <v-checkbox
              v-if="item.bool"
              v-model="newItem[item.value]"
              :disabled="item.disabled"
              class="mt-0"
              color="blue"
              hide-details
              label="Admin"
            />
          </div>
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
import item from '@/mixins/item'

export default {
  name: 'new-item',
  mixins: [
    item
  ],
  props: {
    fields: {
      type: Array,
      required: true
    },
    saveItem: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      active: false,
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
    async save () {
      this.loading = true
      let data = this.newItem

      try {
        await this.saveItem(data)

        this.loading = false
        this.active = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>
