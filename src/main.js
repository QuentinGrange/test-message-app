import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import  {IonicVue } from '@ionic/vue'
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import axios from 'axios' ;
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import {toastController } from '@ionic/vue';
import { Storage } from '@capacitor/storage';
axios.defaults.baseURL = "http://127.0.0.1:8000"

const app = createApp(App)
.use(router)
.use(IonicVue)
.use(VueToast)

axios.interceptors.request.use(
    async config => {
        config.headers['Authorization'] = `Bearer ${(await Storage.get({key:'access_token'})).value}`;
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    });

axios.interceptors.response.use(
    (response) => {
        return response
    },
    async function (error) {
        let originalRequest = error.config;
        if(error.response.status === 401 && originalRequest.url === `${process.env.VUE_APP_SAVANTS_URL}token/refresh/`){
            await router.push('/login') ;
        } else if (error.response.status === 401) {
            await getNewAccessToken();
            return axios(originalRequest);
        } if (error.response && (error.response.config.method === "post" || error.response.config.method === "put" || error.response.config.method === "patch") &&
            !error.response.config.url.includes(`${process.env.VUE_APP_SAVANTS_URL}token/refresh/`) &&
            !error.response.config.url.includes(`${process.env.VUE_APP_SAVANTS_URL}token/`)) {
            toastController.create({
                message: "Une erreur est survenue, certaines de vos modifications n'ont pas pu être sauvegardées",
                color: "warning",
                position: "top",
                duration: 6000
            })
        }
        if (error.response && (error.response.config.method === "get") && error.response.status !== 401) {
            toastController.create({
                message: "Une erreur est survenue, certaines de vos données ne peuvent être chargées",
                color: "error",
                position: "top",
                duration: 6000
            })
        }
    }
)

async function getNewAccessToken() {
    let response = await axios({
        method: "post",
        url: `/v1/auth/token/refresh/`,
        data: {refresh: (await Storage.get({key:'refresh_token'})).value},
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(response === undefined){
        await router.push("/tabs/login")
    }

    await Storage.set({key: "access_token", value: response.data.access})
}


router.isReady().then(() => {
  app.use(store)
  app.mount('#app');
});
