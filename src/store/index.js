import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate'
//import { Storage } from '@capacitor/storage'

export default createStore({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state: {
        isAuthenticated: false,
        token:'',
    },
    mutations: {
        
    },
    actions: {

    },
    modules: {

    }
});
