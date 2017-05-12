import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import Vuetify from 'vuetify';
import Vue2Leaflet from 'vue2-leaflet';

import app from './app';

import auth from 'auth';
import login from 'auth/login';
import register from 'auth/register';

import setup from 'setup';
import communityLeaderSetup from 'setup/community-leader';
import businessLeaderSetup from 'setup/business-leader';

import console from 'console';
import overview from 'console/overview';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuetify);

Vue.component('v-map', Vue2Leaflet.Map);
Vue.component('v-tilelayer', Vue2Leaflet.TileLayer);
Vue.component('v-marker', Vue2Leaflet.Marker);
Vue.component('v-popup', Vue2Leaflet.Popup);

require('assets/images/logo-white.png');

import L from 'leaflet';

L.Icon.Default.imagePath = '/';
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const routes = [
    {path: '/', redirect: '/auth/login'},
    {
        path: '/auth', component: auth, children: [
            {path: '', redirect: 'login'},
            {path: 'login', component: login},
            {path: 'register', component: register}
        ],
    },
    {
        path: '/setup', component: setup, children: [
            {path: 'community-leader', component: communityLeaderSetup},
            {path: 'business-leader', component: businessLeaderSetup}
        ]
    },
    {
        path: '/console', component: console, children: [
            {path: '', redirect: 'overview'},
            {path: 'overview', component: overview, name: 'Overview'}
        ]
    }
];

Vue.http.interceptors.push((request, next) => {
    if (sessionStorage.token) request.headers.set('Authorization',`Bearer ${sessionStorage.token}`);
    next();
})

new Vue({
    el: '#app',
    router: new VueRouter({routes}),
    render: h => h(app)
});
