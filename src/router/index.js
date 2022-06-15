import { createRouter, createWebHistory } from '@ionic/vue-router';
import store from '../store';

const routes = [
    {
      path: '/',
      redirect: '/tabs/Carlist',
    }
  ]
  
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })
  
  
  router.beforeEach((from, to, next) => {
    store.commit("initializeStore")
  const token = store.state.token
  
  if(to.meta.isProtected) {
    if(store.state.isAuthenticated) {
      console.log("vous etes connecte")
      console.log(token)
      next()
    } else {
      console.log("no connection")
      next('/tabs/Login');
    }
  }

  else {
    next()
  }
  })
  
  export default router
  