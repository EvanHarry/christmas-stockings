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
          <v-toolbar-title>Users</v-toolbar-title>
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
            <td>{{ props.item.username }}</td>
            <td class="align-center layout pr-1">
              <v-icon
                v-if="!!props.item.admin"
                color="green"
                icon
                small
              >check</v-icon>
              <v-icon
                v-else
                color="red"
                icon
                small
              >clear</v-icon>
              <v-spacer />
              <edit-item
                :fields="fields"
                :item="props.item"
                :refresh="updateItem"
                :remove-item="removeItem"
                title="User"
              />
            </td>
          </template>
        </v-data-table>
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
      title="User"
    />
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

import EditItem from '@/components/EditItem'
import NewItem from '@/components/NewItem'

export default {
  name: 'users',
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
        { label: 'Username', placeholder: '#####', rules: ['required'], value: 'username', text: true },
        { label: 'Admin', value: 'admin', bool: true }
      ],
      headers: [
        { text: 'Username', value: 'username', sortable: true },
        { text: 'Admin', value: 'admin', sortable: true, width: 120 }
      ],
      items: [],
      loading: false
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    async getUsers () {
      const { data } = await this.$axios.get('/users/')

      this.items = data
    },
    async createItem (item) {
      try {
        let admin = item.admin ? item.admin : false
        const { data } = await this.$axios.post('/users/', { ...item, admin: admin })

        this.alert = {
          msg: `Password - ${data.password}`,
          value: true
        }

        await this.getUsers()
      } catch (e) {
        this.alert = {
          msg: 'Error creating user.',
          value: true
        }

        throw new Error()
      }
    },
    async removeItem (id) {
      try {
        await this.$axios.delete(`/users/${id}/`)

        let i = this.items
          .findIndex(m => m.id === id)

        this.items.splice(i, 1)
      } catch (e) {
        this.alert = {
          msg: 'Error deleting user.',
          value: true
        }

        throw new Error()
      }
    },
    async updateItem (item) {
      try {
        const { data } = await this.$axios.put(`/users/${item.id}/`, { ...item })

        let i = this.items
          .findIndex(m => m.id === item.id)

        this.items.splice(i, 1)
        this.items.push(data)
      } catch (e) {
        this.alert = {
          msg: 'Error updating user.',
          value: true
        }

        throw new Error()
      }
    }
  }
}
</script>
