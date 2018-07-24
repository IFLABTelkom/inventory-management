<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card raised hover>
          <v-container fill-height fluid>
            <v-layout>
              <v-flex xs12 align-end flexbox>
                <span class="headline">IFLAB Inventory Login</span>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-text>
            <v-container>
              <form @submit.prevent="sign_in">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email" label="Email" id="email" v-model="email" type="email">
                      required
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="password" label="Password" id="password" v-model="password" type="password">
                      required
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12>
                    <v-btn type="submit">Sign In</v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import auth from './firebaseAuth'
import firebase from 'firebase'
const auth = firebase.auth()
export default {
  data() {
    return {
      email: null,
      password: null
    }
  },
  methods: {
    sign_in() {
      auth.signInWithEmailAndPassword(this.email, this.password).then(
        cred => {
          this.$router.go({ path: this.$router.path })
        },
        err => {
          alert(err.message)
        }
      )
    }
  }
}
</script>

<style>
</style>
