import { createRouter, createWebHistory } from '@ionic/vue-router';
import NavBar from '../components/NavBar.vue'
import store from '../store';

const routes = [
    {
      path: '/',
      redirect: '/tabs/ConversationList'
    },
    {
      path: '/tabs/',
      component: NavBar,
      children: [
        {
          path: 'ConversationList',
          name: 'ConversationList',
          component: () => import(/* webpackChunkName: "contact" */ '../views/ConversationList.vue'),
          meta:{isProtected : true},
        },
        {
          path: 'Login',
          name: 'Login',
          component: () => import(/* webpackChunkName: "contact" */ '../views/Login.vue'),
          meta:{isProtected : false},
        },
        {
          path: 'Profile',
          name: 'Profile',
          component: () => import(/* webpackChunkName: "contact" */ '../views/Profile.vue'),
          meta:{isProtected : true},
        },
        
      ]
    },
    {
      path: '/Conv/:id',
      name: 'Conv',
      component: () => import(/* webpackChunkName: "contact" */ '../views/Conv.vue'),
      meta:{isProtected : false},
    },

  ]
  
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })
  router.beforeEach((to, from, next) => {
    //store.commit("initializeStore")
  console.log(to.meta.isProtected)
  if(to.meta.isProtected == true) {
    console.log(store.state.isAuthenticated)
    if(store.state.isAuthenticated == true) {
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
  