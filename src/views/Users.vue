<template>
  <v-layout justify-center>
    <v-flex
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
          <v-toolbar-title>Users</v-toolbar-title>
          <v-spacer />
          <new-item
            :fields="fields"
            :save-item="createItem"
            title="User"
          />
        </v-toolbar>
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
        <v-data-iterator
          v-else
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
              >User</span>
              <v-spacer />
              <edit-item
                :fields="fields"
                :item="props.item"
                :refresh="updateItem"
                :remove-item="removeItem"
                title="User"
              />
            </div>
            <v-list
              class="pt-0"
              dense
            >
              <v-divider />
              <v-list-tile>
                <v-list-tile-content>Username:</v-list-tile-content>
                <span class="text-xs-right">{{ props.item.username }}</span>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>Admin:</v-list-tile-content>
                <span class="text-xs-right">
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
                </span>
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

        this.getUsers()
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

        this.alert = {
          msg: 'Deleted user.',
          value: true
        }

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
        let admin = item.admin ? item.admin : false

        const { data } = await this.$axios.put(`/users/${item.id}/`, { ...item, admin: admin })

        this.alert = {
          msg: 'Updated user.',
          value: true
        }

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
