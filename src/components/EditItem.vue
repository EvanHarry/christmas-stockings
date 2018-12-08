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
        <v-toolbar-title>Edit {{ title }}</v-toolbar-title>
        <v-spacer />
        <v-tooltip
          v-if="item.last_modified"
          bottom
        >
          <v-btn
            slot="activator"
            icon
          >
            <v-icon>history</v-icon>
          </v-btn>
          <span>Date - {{ item.last_modified.split(' - ')[0] }}<br ></span>
          <span>User - {{ item.last_modified.split(' - ')[1] }}<br ></span>
        </v-tooltip>
        <v-btn
          :disabled="loading"
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
          <div
            v-for="(item, i) in fields"
            :key="i"
          >
            <v-text-field
              v-if="item.text"
              v-model="editItem[item.value]"
              :label="item.label"
              :placeholder="item.placeholder"
              :rules="getRules(item.rules)"
            />
            <v-checkbox
              v-if="item .bool"
              v-model="editItem[item.value]"
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
import item from './item'

export default {
  name: 'edit-item',
  mixins: [
    item
  ],
  props: {
    item: {
      type: Object,
      required: true
    },
    refresh: {
      type: Function,
      required: true
    },
    removeItem: {
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
      editItem: {},
      valid: false
    }
  },
  watch: {
    active () {
      this.editItem = JSON.parse(JSON.stringify(this.item))
    }
  },
  methods: {
    async remove () {
      this.loading = true
      let id = this.item.id

      await this.removeItem(id)

      this.loading = false
      this.active = false
    },
    async update () {
      this.loading = true
      let data = this.editItem

      try {
        await this.refresh(data)

        this.loading = false
        this.active = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>
