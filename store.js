import Vue from 'vue';
import jwtDecode from 'jwt-decode';
import {MARKERS} from 'common/categories';

var initialization = undefined;

function set(context, token) {
    let merged = {...jwtDecode(token), token};
    try {
        for (let k in merged) {
            if (merged.hasOwnProperty(k)) sessionStorage.setItem(k, merged[k]);
        }
    } catch (e) {
        console.log('session storage not supported: ', e);
    }
    context.commit('setAccount', merged);
    return merged;
}

function update(context, account) {
    let merged = {...context.state.account, account};
    try {
        for (let k in merged) {
            if (merged.hasOwnProperty(k) && k !== 'organizations') sessionStorage.setItem(k, merged[k]);
        }
    } catch (e) {
        console.log('session storage not supported: ', e);
    }
    context.commit('setAccount', merged);
    return merged;
}

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
            try {
                sessionStorage.clear();
            } catch (e) {
                console.log('session storage not supported: ', e);
            }
            state.account = undefined;
        }
    },
    actions: {
        login (context, account) {
            return Vue.http.post('/auth/login', {email: account.email, password: account.password})
                .then(({data: {token}}) => set(context, token))
                .then(() => context.dispatch('initializeAccountOrganizations'));
        },
        activate (context, {password, token}) {
            return Vue.http.post('/auth/activate', {password}, {headers: {Authorization: `Bearer ${token}`}})
                .then(({data: {token}}) => set(context, token))
                .then(() => context.dispatch('initializeAccountOrganizations'));
        },
        update (context, account) {
            return Vue.http.put(`/accounts/${context.state.account.id}`, {email: account.email, firstName: account.firstName, lastName: account.lastName})
                .then(({data: account}) => update(context, account));
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
                try {
                    if (!sessionStorage.id) {
                        context.commit('clearAccount');
                        resolve(undefined);
                        return initialization = undefined;
                    }
                } catch (e) {
                    console.log('session storage not supported: ', e);
                    if (!context.state.id) {
                        context.commit('clearAccount');
                        resolve(undefined);
                        return initialization = undefined;
                    }
                }
                var account = undefined;
                try {
                    account = {...sessionStorage, isSuper: sessionStorage.isSuper == 'true'};
                } catch (e) {
                    console.log('session storage not supported: ', e);
                    account = context.state.account;
                }
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
