<template>

    <ion-page>
      <ion-content style="--overflow:hidden">
    <ion-tabs @ionTabsWillChange="ontabchange">
      <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button :disabled="!$store.state.isAuthenticated" class="conversations" tab="conversations" href="/tabs/ConversationList">
            <ion-label>Conversations</ion-label>
            <ion-icon :icon="key"></ion-icon>
          </ion-tab-button>
          
          <ion-tab-button class="profile" tab="Profile" :href="$store.state.isAuthenticated ? '/tabs/Profile' : '/tabs/Login'">
            <ion-label>Mon Compte</ion-label>
            <ion-icon  :icon="personCircle"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
    </ion-tabs>
      </ion-content>
    </ion-page>
</template>

<script>

import { key, personCircle, map } from 'ionicons/icons';
import { IonIcon, IonTabButton, IonTabBar, IonLabel, IonPage, IonTabs, IonRouterOutlet, IonContent } from '@ionic/vue'
export default {
    name: 'NavBar',
    components:{ IonIcon,  IonTabButton, IonTabBar, IonLabel, IonPage, IonTabs, IonRouterOutlet, IonContent },
    data() {
      return {
          choice: 'carlist',
          key, map,
          personCircle
      }
    },
}

</script>

<style lang="scss" scoped>

</style>