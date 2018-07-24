<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <v-list-tile v-if="is_logged_in" @click="go_home">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="!is_logged_in" @click="go_login">
          <v-list-tile-action>
            <v-icon>input</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="is_logged_in" @click="go_logout">
          <v-list-tile-action>
            <v-icon>keyboard_backspace</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/">IFLAB Inventory Manager</router-link>
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer color="indigo" app>
      <v-flex text-xs-center white--text>
        IFLAB - KP &copy; 2018
      </v-flex>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from 'firebase'

export default {
  data: () => ({
    current_user: false,
    drawer: false,
    is_logged_in: false
  }),
  beforeMount() {
    if (firebase.auth().currentUser) {
      this.is_logged_in = true
      this.current_user = firebase.auth().currentUser.email
    } else {
      this.is_logged_in = false
    }
  },
  props: {
    source: String
  },
  created() {
    if (firebase.auth().currentUser) {
      this.is_logged_in = true
      this.current_user = firebase.auth().currentUser.email
    } else {
      this.is_logged_in = false
    }
  },
  methods: {
    go_home() {
      this.$router.push('/')
    },
    go_login() {
      this.$router.push('/login')
    },
    go_logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.go({ path: this.$router.path })
        })
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: white;
}
</style>
