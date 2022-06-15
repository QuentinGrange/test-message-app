import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import  {IonicVue } from '@ionic/vue'


const app = createApp(App)
.use(router)
.use(IonicVue)

router.isReady().then(() => {
  app.use(store)
  app.mount('#app');
});
