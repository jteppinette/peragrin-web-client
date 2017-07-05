<template>
<v-dialog v-model="dialog" width="800px" scrollable persistent>
  <v-btn floating slot="activator" class="white"><v-icon dark>edit</v-icon></v-btn>
  <v-card v-if="data">
    <v-card-title class="primary">Update Organization</v-card-title>
    <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
    <v-card-row>
      <v-card-text>
        <form @submit.prevent="update" novalidate>
          <organization-form v-model="data"></organization-form>
          <organization-hours v-model="data.hours"></organization-hours>

          <div class="right">
            <v-btn flat @click.native="dialog = false">Close</v-btn>
            <v-btn primary type="submit" class="white--text">Update Organization</v-btn>
          </div>
        </form>
      </v-card-text>
    </v-card-row>
  </v-card>
</v-dialog>
</template>
<script>
import organizationForm from 'common/organization/form';
import organizationHours from 'common/organization/hours';

export default {
  props: ['organization'],
  data: () => ({msg: '', error: false, dialog: false}),
  components: {organizationForm, organizationHours},
  computed: {
    data () {
      return this.organization ? JSON.parse(JSON.stringify(this.organization)) : undefined;
    }
  },
  methods: {update}
};

function update() {
  return this.$http.post(`/organizations/${this.organization.id}`, this.data)
    .then(response => response.json())
    .then(organization => this.$emit('updated', {...this.organization, ...organization}))
    .then(() => this.dialog = false)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>

<style scoped lang="stylus">
.dialog__container {
  display: block;
}

.dialog .card__text {
  max-height: 80vh;
}
</style>
