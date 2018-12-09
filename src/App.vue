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
        <v-tooltip
          v-if="apiVersion"
          bottom
        >
          <v-btn
            slot="activator"
            icon
          >
            <v-icon>info</v-icon>
          </v-btn>
          <span>API Version {{ apiVersion }}<br ></span>
        </v-tooltip>
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
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters([
      'admin',
      'loggedIn'
    ]),
    ...mapState([
      'apiVersion'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ])
  }
}
</script>
