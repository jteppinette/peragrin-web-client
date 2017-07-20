<template>
<v-dialog v-model="value" width="400px" scrollable persistent>
  <v-card>
    <v-card-title class="primary title">{{ action.name }} Promotion</v-card-title>
    <form @submit.prevent="action.method" novalidate>

      <v-card-text>
        <v-text-field v-model="data.name" :error="error" label="Name"></v-text-field>
        <v-text-field v-model="data.description" :error="error" label="Description" rows="1" multi-line></v-text-field>
        <v-text-field v-model="data.exclusions" :error="error" label="Exclusions" rows="1" multi-line></v-text-field>

        <v-subheader class="pa-0 pt-2" style="height: 0px">Required Community Membership</v-subheader>
        <v-select :items="memberships" v-model="data.membershipID" itemText="name" itemValue="id" label="Membership" single-line auto></v-select>
      </v-card-text>

      <v-card-actions class="secondary">
        <v-spacer></v-spacer>
        <v-btn flat class="white--text" @click.native="$emit('input', false)">Close</v-btn>
        <v-btn outline class="white--text" :error="error" :loading="submitting" type="submit">{{ action.name }}</v-btn>
      </v-card-actions>

      <v-snackbar v-if="value" v-model="error" error>{{ msg }}
        <v-btn flat @click.native="error = false" class="white--text">Close</v-btn>
      </v-snackbar>

    </form>
  </v-card>
</v-dialog>
</template>
<script>
export default {
  props: ['promotion', 'organizationID', 'value'],
  data: () => ({submitting: false, msg: '', error: false, memberships: []}),
  methods: {create, update, initializeMemberships},
  mounted: initialize,
  computed: {
    action () {
      return this.promotion ? {name: 'Update', method: this.update, icon: 'edit'} : {name: 'Create', method: this.create, icon: 'add'};
    },
    data () {
      return this.promotion ? JSON.parse(JSON.stringify(this.promotion)) : {
        name: '',
        description: '',
        exclusions: '',
        membershipID: null
      };
    }
  }
};

function initialize() {
  return this.initializeMemberships();
}

function initializeMemberships() {
  let that = this;
  return this.$http.get(`/organizations/${this.organizationID}/communities`)
    .then(({data: communities}) => Promise.all(communities.map(fn)))

  function fn(community) {
    return that.$http.get(`/communities/${community.id}/memberships`)
      .then(({data: memberships}) => that.memberships.push({header: community.name}, ...memberships));
  }
}

function create() {
  this.submitting = true;
  return this.$http.post(`/organizations/${this.organizationID}/promotions`, this.data)
    .then(({data: promotion}) => this.$emit('created', promotion))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}

function update() {
  this.submitting = true;
  return this.$http.put(`/promotions/${this.promotion.id}`, this.data)
    .then(({data: promotion}) => this.$emit('updated', promotion))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}
</script>
