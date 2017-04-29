<template>
<form @keyup.enter="register" class="pa-3">
  <v-text-field v-model="email" prepend-icon="mail" type="email" label="Email"></v-text-field>
  <v-text-field v-model="password" prepend-icon="lock" type="password" label="Password"></v-text-field>
  <!-- TODO: vuetify#224 get update to allow keyboard controls -->
  <v-select v-model="community" prepend-icon="account_balance" label="Community" :items="communities" autocomplete item-text="name" item-value="name" />
  <v-text-field v-model="organization.name" prepend-icon="home" type="text" label="Organization Name"></v-text-field>
  <v-text-field v-model="organization.address" prepend-icon="location_on" type="address" label="Organization Address"></v-text-field>
  <v-btn @click.native="register" block primary>Register</v-btn>
  <p class="pt-2 text-xs-center"><router-link to="/login">If you already have an account, then click here to login.</router-link></p>
</form>
</template>

<script>
import jwtDecode from 'jwt-decode';

export default {
  data: () => ({email: '', password: '', organization: {}, community: {}, communities: []}),
  methods: {register},
  mounted,
  watch: {
    community: function (community) {
      this.organization.communityID = community.id;
    }
  }
};

function mounted() {
  return this.$http.get('/communities')
    .then(response => response.json())
    .then(communities => this.communities = communities);
}

function register() {
  return this.$http.post('/register', {email: this.email, password: this.password, organization: this.organization})
    .then(response => response.json())
    .then(function({token}) {
      var {mapboxAPIKey, id, email, organizationID} = jwtDecode(token);
      sessionStorage.token = token;
      sessionStorage.mapboxAPIKey = mapboxAPIKey;
      sessionStorage.userID = id;
      sessionStorage.email = email;
      sessionStorage.organizationID = organizationID;
    })
    .then(() => this.$router.push('/overview'));

}
</script>

<style lang="stylus" scope>
.input-group__selections__comma {
  margin-left: 10px;
}
.input-group--select.input-group--focused.input-group--dirty .input-group--select__autocomplete {
  margin: 0px 0px;
}
</style>

