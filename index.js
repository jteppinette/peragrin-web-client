import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import Vuetify from 'vuetify';

import app from './app';

import unauthenticated from 'unauthenticated';
import login from 'unauthenticated/login';
import register from 'unauthenticated/register';

import setup from 'setup';
import communityLeaderSetup from 'setup/community-leader';
import businessLeaderSetup from 'setup/business-leader';

import authenticated from 'authenticated';
import overview from 'authenticated/overview';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuetify);

const routes = [
    {
        path: '/', component: unauthenticated, children: [
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
