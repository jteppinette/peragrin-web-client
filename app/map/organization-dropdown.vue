<template>
<div>

  <v-card-media :src="organization.logoURL" height="130px"></v-card-media>

  <v-tabs grow dark :scrollable="false" v-model="active" class="no-border">

    <!-- BAR -->
    <v-tabs-bar slot="activators" class="secondary">
      <v-tabs-item ripple href="#general">General</v-tabs-item>
      <v-tabs-item ripple href="#promotions" v-if="organization.promotions && organization.promotions.length">Promotions</v-tabs-item>
    </v-tabs-bar>

    <!-- GENERAL -->
    <v-tabs-content id="general">
      <organizations-details :dense="true" :organization="organization"></organizations-details>
    </v-tabs-content>

    <!-- PROMOTIONS -->
    <v-tabs-content id="promotions">
      <organization-promotions :organization="organization"></organization-promotions>
    </v-tabs-content>

  </v-tabs>

</div>
</template>
<script>
import organizationsDetails from 'common/organizations/details';
import organizationPromotions from './organization-promotions';

export default {
  props: ['organization'],
  data: () => ({active: undefined}),
  components: {organizationsDetails, organizationPromotions}
};
</script>
