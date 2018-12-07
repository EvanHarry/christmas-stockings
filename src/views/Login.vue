<template>
  <v-layout align-center justify-center>
    <v-flex xs4>
      <v-card raised>
        <v-toolbar card color="red darken-3" dark dense>
          <v-toolbar-title>Please Login</v-toolbar-title>
        </v-toolbar>
        <v-form ref="form" v-model="valid" @submit="login">
          <v-card-text>
            <v-text-field :rules="usernameRules" v-model="username" label="Username" placeholder="User" />
            <v-text-field :rules="passwordRules" v-model="password" label="Password" placeholder="********" type="password" />
          </v-card-text>
          <v-card-actions>
            <v-btn :disabled="!valid || loading" :loading="loading" block color="primary" outline type="submit">Submit</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      username: '',
      usernameRules: [
        v => !!v || 'Username is required'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      valid: false
    }
  },
  computed: {
    ...mapState([
      'loading'
    ])
  },
  methods: {
    async login (e) {
      e.preventDefault()

      if (this.$refs.form.validate()) {
        try {
          await this.$store.dispatch('login', {
            username: this.username,
            password: this.password
          })

          this.$router.push('/')
        } catch (e) {
          console.log(e.message)
        }
      }
    }
  }
}
</script>
