import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import Vuetify from 'vuetify';
import Vue2Leaflet from 'vue2-leaflet';

import app from 'app.vue';

import unauthenticated from 'unauthenticated/unauthenticated.vue';
import login from 'unauthenticated/login.vue';
import register from 'unauthenticated/register.vue';

import authenticated from 'authenticated/authenticated.vue';
import overview from 'authenticated/overview.vue';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuetify);

Vue.component('v-map', Vue2Leaflet.Map);
Vue.component('v-tilelayer', Vue2Leaflet.TileLayer);
Vue.component('v-marker', Vue2Leaflet.Marker);
Vue.component('v-poly', Vue2Leaflet.Polyline);
Vue.component('v-group', Vue2Leaflet.LayerGroup);
Vue.component('v-tooltip', Vue2Leaflet.Tooltip);
Vue.component('v-popup', Vue2Leaflet.Popup);

const routes = [
    {
        path: '/', component: unauthenticated, children: [
            {path: '', redirect: 'login'},
            {path: 'login', component: login},
            {path: 'register', component: register}
        ],
    },
    {
        path: '/', component: authenticated, children: [
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
