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
Vue.component('v-tooltip', Vue2Leaflet.Tooltip);
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
    {path: '/', component: app, meta: {auth: true}, children: [
        {path: 'map', meta: {auth: false}, component: map},
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

import s from './store';
import index from './index.vue';

let store = new Vuex.Store(s);
let router  = new VueRouter({routes});

router.beforeEach((to, from, next) => {
    let required = false;
    for (let i = to.matched.length - 1; i >= 0; i--) {
        if (to.matched[i].meta.hasOwnProperty('auth')) {
            required = to.matched[i].meta.auth;
            break;
        }
    }
    return store.dispatch('initialize').then(() => {
        return next((required && !store.state.account) ? {path: '/auth/login', query: {redirect: to.fullPath}} : undefined);
    });
});

Vue.http.interceptors.push((request, next) => {
    if (store.state.account) request.headers.set('Authorization',`Bearer ${store.state.account.token}`);
    next();
})

new Vue({
    el: '#peragrin',
    store,
    router,
    render: h => h(index)
});
