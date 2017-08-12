import Vue from 'vue';
import jwtDecode from 'jwt-decode';
import {MARKERS} from 'common/categories';

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
            if (merged.hasOwnProperty(k)) sessionStorage.setItem(k, merged[k]);
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
        organizations: undefined,
        communities: undefined
    },
    mutations: {
        setAccount (state, payload) {
            state.account = payload;
        },
        setOrganizations (state, payload) {
            state.organizations = payload;
        },
        addOrganization (state, payload) {
            state.organizations.push(payload);
        },
        setCommunities (state, payload) {
            state.communities = payload;
        },
        addCommunity (state, payload) {
            state.communities.push(payload);
        },
        clear (state) {
            try {
                sessionStorage.clear();
            } catch (e) {
                console.log('session storage not supported: ', e);
            }
            state.account = undefined;
            state.organizations = undefined;
            state.communities = undefined;
        }
    },
    actions: {
        login (context, account) {
            return Vue.http.post('/auth/login', {email: account.email, password: account.password})
                .then(({data: {token}}) => set(context, token));
        },
        activate (context, {password, token}) {
            return Vue.http.post('/auth/activate', {password}, {headers: {Authorization: `Bearer ${token}`}})
                .then(({data: {token}}) => set(context, token));
        },
        update (context, account) {
            return Vue.http.put(`/accounts/${context.state.account.id}`, {email: account.email, firstName: account.firstName, lastName: account.lastName})
                .then(({data: account}) => update(context, account));
        },
        initialize (context) {
            try {
                sessionStorage.setItem('test', 1);
                if (!sessionStorage.id) {
                    context.commit('clear');
                    return undefined;
                }
            } catch (e) {
                console.log('session storage not supported: ', e);
                if (context.state.account && !context.state.account.id) {
                    context.commit('clear');
                    return undefined;
                }
            }
            var account = undefined;
            try {
                sessionStorage.setItem('test', 1);
                account = {email: sessionStorage.email, token: sessionStorage.token, firstName: sessionStorage.firstName, lastName: sessionStorage.lastName, id: sessionStorage.id, isSuper: sessionStorage.isSuper == 'true'};
            } catch (e) {
                console.log('session storage not supported: ', e);
                account = context.state.account;
            }
            context.commit('setAccount', account);
            return account;
        },
        logout (context) {
            return context.commit('clear');
        }
    }
};
