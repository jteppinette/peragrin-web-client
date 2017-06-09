import Vue from 'vue';
import jwtDecode from 'jwt-decode';

var initialization = undefined;

export default {
    state: {
        account: undefined,
        community: undefined,
        organization: undefined
    },
    mutations: {
        setAccount (state, payload) {
            state.account = payload;
        },
        setAccountOrganizations (state, organizations) {
            Vue.set(state.account, 'organizations', organizations);
        },
        setOrganizationCommunities (state, communities) {
            Vue.set(state.organization, 'communities', communities);
        },
        setOrganizationHours (state, hours) {
            Vue.set(state.organization, 'hours', hours);
        },
        assumeOrganization (state, organization) {
            state.organization = organization;
        },
        assumeCommunity (state, community) {
            state.community = community;
        },
        clearAccount (state) {
            sessionStorage.clear();
            state.community = state.organization = state.account = undefined;
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
                    context.commit('setAccountOrganizations', organizations);
                    context.commit('assumeOrganization', organizations[0]);
                    var hours = Vue.http.get(`/organizations/${organizations[0].id}/hours`)
                        .then(response => response.json())
                        .then(hours => context.commit('setOrganizationHours', hours));
                    var communities = Vue.http.get(`/organizations/${organizations[0].id}/communities`)
                        .then(response => response.json())
                        .then(v => {
                            if (v && v.length) {
                                context.commit('setOrganizationCommunities', v)
                                context.commit('assumeCommunity', v[0]);
                            }
                        });
                    return Promise.all([hours, communities])
                        .then(() => ({
                            account: context.state.account,
                            organization: context.state.organization,
                            community: context.state.community
                        }));
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
