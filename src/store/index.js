import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import { Storage } from '@capacitor/storage';
//import { Storage } from '@capacitor/storage'

export default createStore({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state: {
        isAuthenticated: false,
        user: {}
    },
    mutations: {
        setUser(state,user) {
            state.user = user
            state.isAuthenticated = true
        },
        removeUser(state) {
            Storage.remove({key: 'access_token'})
            Storage.remove({key: 'refresh_token'})
            state.user = null
            state.isAuthenticated = false
        }
    },
    actions: {

    },
    modules: {

    }
});
