import Vue from 'vue';
import jwtDecode from 'jwt-decode';

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
                .then(response => response.json())
                .then(function({token}) {
                    var {id, email} = jwtDecode(token);
                    sessionStorage.token = token;
                    sessionStorage.userID = id;
                    sessionStorage.email = email;
                    context.commit('setAccount', {id, email});
                })
                .then(() => context.dispatch('initializeAccountOrganizations'));
        },
        update (context, account) {
            return Vue.http.post('/auth/account', {email: account.email, password: account.password})
                .then(response => response.json())
                .then(function({id, email}) {
                    sessionStorage.email = email;
                    context.commit('setAccount', {id, email, organizations: context.state.account.organizations});
                    return context.state.account;
                });
        },
        initializeAccountOrganizations (context) {
            return Vue.http.get('/auth/organizations')
                .then(response => response.json())
                .then(organizations => {
                    if (!organizations.length) return {account: context.state.account};
                    return Promise.all(organizations.map(o => {
                        return Vue.http.get(`/organizations/${o.id}/communities`)
                            .then(response => response.json())
                            .then(communities => ({...o, communities: communities}));
                    }))
                        .then(organizations => context.commit('setAccountOrganizations', organizations))
                        .then(() => ({account: context.state.account}));
                });
        },
        register (context, account) {
            return Vue.http.post('/auth/register', {email: account.email, password: account.password})
                .then(response => response.json())
                .then(function({token}) {
                    var {id, email} = jwtDecode(token);
                    sessionStorage.token = token;
                    sessionStorage.userID = id;
                    sessionStorage.email = email;
                    context.commit('setAccount', {id, email});
                    return context.state.acount;
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
                var account = {id: sessionStorage.userID, email: sessionStorage.email};
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
