require('object.assign/shim')();

import Vue from 'vue';
import VueMoment from 'vue-moment';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuetify);
Vue.use(VueMoment);

import Vue2Leaflet from 'vue2-leaflet';

Vue.component('v-map', Vue2Leaflet.Map);
Vue.component('v-tilelayer', Vue2Leaflet.TileLayer);
Vue.component('v-marker', Vue2Leaflet.Marker);
Vue.component('v-popup', Vue2Leaflet.Popup);
Vue.component('v-geojson-layer', Vue2Leaflet.GeoJSON);

import app from './app';
import map from 'map';

import auth from './auth';
import login from 'login';
import register from 'register';
import forgotPassword from 'forgot-password';
import setPassword from 'set-password';
import activate from 'activate';

import profile from 'profile';

import setup from 'setup';
import communityLeaderSetup from 'setup/community-leader';
import businessLeaderSetup from 'setup/business-leader';

import communitiesManage from 'communities/manage';
import communitiesDetail from 'communities/detail';
import communitiesMembershipsDetail from 'communities/memberships/detail';

import organizationsManage from 'organizations/manage';
import organizationsDetail from 'organizations/detail';

require('./assets/images/favicon-64.png');

const routes = [
    {path: '/', redirect: '/map'},
    {path: '/', component: app, children: [
        {path: 'map', component: map},
        {path: 'organizations', component: organizationsManage},
        {path: 'organizations/:id', component: organizationsDetail, props: true},
        {path: 'communities', component: communitiesManage},
        {path: 'communities/:id', component: communitiesDetail, props: true},
        {path: 'communities/:communityID/memberships/:membershipID', component: communitiesMembershipsDetail, props: true},
        {path: 'profile', component: profile},
        {path: 'setup', component: setup, children: [
            {path: 'community-leader', component: communityLeaderSetup},
            {path: 'business-leader', component: businessLeaderSetup}
        ]}
    ]},
    {
        path: '/auth', component: auth, children: [
            {path: '', redirect: 'login'},
            {path: 'login', component: login},
            {path: 'register', component: register},
            {path: 'forgot-password', component: forgotPassword},
            {path: 'set-password', component: setPassword},
            {path: 'activate', component: activate}
        ],
    }
];

Vue.http.interceptors.push((request, next) => {
    if (sessionStorage.token) request.headers.set('Authorization',`Bearer ${sessionStorage.token}`);
    next();
})

import store from './store';
import index from './index.vue';

new Vue({
    el: '#peragrin',
    store: new Vuex.Store(store),
    router: new VueRouter({routes}),
    render: h => h(index)
});
