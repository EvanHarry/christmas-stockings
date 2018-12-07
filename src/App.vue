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
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-title>
        <span class="font-weight-light">CHRISTMAS STOCKINGS</span>
      </v-toolbar-title>
      <!-- <v-spacer /> -->
      <!-- <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn> -->
      <!-- <v-btn icon>
        <v-icon>account_circle</v-icon>
      </v-btn> -->
    </v-toolbar>

    <v-content>
      <v-container fill-height fluid class="pa-2">
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>
