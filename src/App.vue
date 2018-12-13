<template>
  <v-app>
    <v-toolbar
      app
      color="green darken-3"
      dark
      dense
    >
      <v-toolbar-title class="headline text-uppercase">
        <span>Tidings Padstow</span>
        <span v-if="$vuetify.breakpoint.mdAndUp" class="font-weight-light">CHRISTMAS STOCKINGS</span>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items v-if="loggedIn">
        <v-btn
          v-for="(item, i) in items"
          :icon="$vuetify.breakpoint.smAndDown"
          :key="i"
          flat
          @click="$router.push(item.to)"
        >
          <span v-if="$vuetify.breakpoint.mdAndUp">{{ item.text }}</span>
          <v-icon v-if="$vuetify.breakpoint.smAndDown">{{ item.icon }}</v-icon>
        </v-btn>
        <v-btn
          :icon="$vuetify.breakpoint.smAndDown"
          flat
          @click="logout($router)"
        >
          <span v-if="$vuetify.breakpoint.mdAndUp">Logout</span>
          <v-icon v-if="$vuetify.breakpoint.smAndDown">exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container
        fill-height
        fluid
        class="pa-2 pb-2"
      >
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      items: [
        { text: 'Home', icon: 'home', admin: true, to: '/' },
        { text: 'Users', icon: 'supervisor_account', admin: true, to: '/users' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'admin',
      'loggedIn'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ])
  }
}
</script>
