import Vue from 'vue';
import jwtDecode from 'jwt-decode';
import {MARKERS} from 'common/categories';

var initialization = undefined;

export default {
    state: {
        account: undefined,
    },
    mutations: {
        setAccount (state, payload) {
            state.account = payload;
        },
        setAccountOrganizations (state, organizations) {
            Vue.set(state.account, 'organizations', organizations);
        },
        clearAccount (state) {
            sessionStorage.clear();
            state.account = undefined;
        }
    },
    actions: {
        login (context, account) {
            return Vue.http.post('/auth/login', {email: account.email, password: account.password})
                .then(({data: {token}}) => {
                    var {id, email, firstName, lastName} = jwtDecode(token);
                    sessionStorage.token = token;
                    sessionStorage.userID = id;
                    sessionStorage.email = email;
                    sessionStorage.firstName = firstName ? firstName : '';
                    sessionStorage.lastName = lastName ? lastName : '';
                    context.commit('setAccount', {id, email, firstName, lastName});
                })
                .then(() => context.dispatch('initializeAccountOrganizations'));
        },
        activate (context, {password, token}) {
            return Vue.http.post('/auth/activate', {password}, {headers: {Authorization: `Bearer ${token}`}})
                .then(({data: {token}}) => {
                    var {id, email, firstName, lastName} = jwtDecode(token);
                    sessionStorage.token = token;
                    sessionStorage.userID = id;
                    sessionStorage.email = email;
                    sessionStorage.firstName = firstName ? firstName : '';
                    sessionStorage.lastName = lastName ? lastName : '';
                    context.commit('setAccount', {id, email, firstName, lastName});
                })
                .then(() => context.dispatch('initializeAccountOrganizations'));
        },
        update (context, account) {
            return Vue.http.put(`/accounts/${context.state.account.id}`, {email: account.email, firstName: account.firstName, lastName: account.lastName})
                .then(({data: {id, email, firstName, lastName}}) => {
                    sessionStorage.email = email;
                    sessionStorage.firstName = firstName ? firstName : '';
                    sessionStorage.lastName = lastName ? lastName : '';
                    context.commit('setAccount', {id, email, firstName, lastName, organizations: context.state.account.organizations});
                    return context.state.account;
                });
        },
        initializeAccountOrganizations (context) {
            return Vue.http.get(`/accounts/${context.state.account.id}/organizations`)
                .then(({data: organizations}) => organizations.map(o => ({...o, icon: MARKERS[o.category]})))
                .then(organizations => {
                    if (!organizations.length) return {account: context.state.account};
                    return Promise.all(organizations.map(o => {
                        return Vue.http.get(`/organizations/${o.id}/communities`)
                            .then(({data: communities}) => ({...o, communities: communities}));
                    }))
                        .then(organizations => context.commit('setAccountOrganizations', organizations))
                        .then(() => ({account: context.state.account}));
                });
        },
        initialize (context) {
            if (initialization) return initialization;
            return initialization = new Promise((resolve, reject) => {
                if (!sessionStorage.userID) {
                    context.commit('clearAccount');
                    resolve(undefined);
                    return initialization = undefined;
                }
                var account = {id: sessionStorage.userID, email: sessionStorage.email, firstName: sessionStorage.firstName, lastName: sessionStorage.lastName};
                context.commit('setAccount', account);
                return context.dispatch('initializeAccountOrganizations')
                    .then(resolve, reject)
                    .then(() => initialization = undefined);
            });
        },
        logout (context) {
            return context.commit('clearAccount');
        }
    }
};
