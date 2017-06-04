import Vue from 'vue';
import jwtDecode from 'jwt-decode';

export default {
    state: {
        account: {}
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
            state.account = {};
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
                    return {id, email};
                })
                .then(account => context.dispatch('initializeAccountOrganizations', account));
        },
        update (context, account) {
            return Vue.http.post('/auth/account', {email: account.email, password: account.password})
                .then(response => response.json())
                .then(function({id, email}) {
                    sessionStorage.email = email;
                    context.commit('setAccount', {id, email, organizations: context.state.account.organizations});
                    return {id, email};
                });
        },
        initializeAccountOrganizations (context, {id, email}) {
            return Vue.http.get('/auth/organizations')
                .then(response => response.json())
                .then(organizations => {
                    if (!organizations.length) return {id, email};
                    context.commit('setAccountOrganizations', organizations);
                    return {id, email, organizations};
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
                    return {id, email};
                });
        },
        initialize (context) {
            if (sessionStorage.userID) {
                var account = {id: sessionStorage.userID, email: sessionStorage.email};
                context.commit('setAccount', account);
                return context.dispatch('initializeAccountOrganizations', account);
            }
            return context.commit('clearAccount');
        },
        logout (context) {
            return context.commit('clearAccount');
        }
    }
};
