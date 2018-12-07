<template>
  <v-layout
    align-center
    justify-center
  >
    <v-flex xs4>
      <v-card raised>
        <v-toolbar
          card
          color="red darken-3"
          dark
          dense
        >
          <v-toolbar-title>Please Login</v-toolbar-title>
        </v-toolbar>
        <v-form
          ref="form"
          v-model="valid"
          @submit="login"
        >
          <v-card-text>
            <v-text-field
              v-model="username"
              :rules="usernameRules"
              label="Username"
              placeholder="User"
            />
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              placeholder="********"
              type="password"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!valid || loading"
              :loading="loading"
              block
              color="primary"
              depressed
              type="submit"
            >
              <span>Submit</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
    <v-snackbar
      v-model="error.value"
      bottom
      color="grey darken-3"
    >
      <span>{{ error.msg }}</span>
      <v-btn
        color="white"
        flat
        icon
        @click="error.value = false"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      error: {
        msg: '',
        value: false
      },
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
          this.error.msg = e.data.message
          this.error.value = true
        }
      }
    }
  }
}
</script>
