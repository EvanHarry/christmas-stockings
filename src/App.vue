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
        <span class="font-weight-light">CHRISTMAS STOCKINGS</span>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items v-if="loggedIn">
        <v-btn
          icon
          @click="$router.push('/')"
        >
          <v-icon>home</v-icon>
        </v-btn>
        <v-btn
          v-if="admin"
          icon
          @click="$router.push('/users')"
        >
          <v-icon>supervisor_account</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="logout($router)"
        >
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container
        fill-height
        fluid
        class="pa-2"
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
