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

import app from './app';
import map from 'map';

import auth from './auth';
import login from 'login';
import register from 'register';

import setup from 'setup';
import communityLeaderSetup from 'setup/community-leader';
import businessLeaderSetup from 'setup/business-leader';

import overview from 'overview';

const routes = [
    {path: '/', redirect: '/map'},
    {path: '/', component: app, children: [
        {path: 'map', component: map},
        {path: 'overview', component: overview},
        {path: 'setup', component: setup, children: [
            {path: 'community-leader', component: communityLeaderSetup},
            {path: 'business-leader', component: businessLeaderSetup}
        ]}
    ]},
    {
        path: '/auth', component: auth, children: [
            {path: '', redirect: 'login'},
            {path: 'login', component: login},
            {path: 'register', component: register}
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
