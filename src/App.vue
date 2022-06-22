<template>
  <div id="app">
    <ion-app>
      <ion-page>
        <ion-content>
          <ion-router-outlet/>
      </ion-content>
      </ion-page>
    </ion-app>
  </div>
</template>

<script>

import {IonPage, IonRouterOutlet, IonApp, IonContent} from '@ionic/vue'

export default {
  name: 'App',
  components: {
    IonPage, IonRouterOutlet, IonApp, IonContent
  }
}
</script>

<style>
.myContentTop{
  height: env(safe-area-inset-top);
  --background: white;
}


.myContentBottom{
  z-index:10;
  height: calc(env(safe-area-inset-bottom)/2);
  background-color:#f4f5f8;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
