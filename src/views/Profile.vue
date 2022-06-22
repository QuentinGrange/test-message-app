<template>
    <ion-page>
      <ion-toolbar  class="myContentTop">
      </ion-toolbar>
        <ion-content>
          <h1>Hello, {{ $store.state.user.first_name }} {{ $store.state.user.last_name }}</h1>
          <img class="profile_pic" src="../assets/avatar.png">
          <br>
            <ion-chip outline>

                <ion-icon color="primary" :icon="pencil"></ion-icon>
                <ion-label class="label_modify" color="primary">Modifier</ion-label>
            </ion-chip>

            <ion-list inset="true" button="true" mode="ios">
                <ion-item lines="none" color="light" mode="ios" id="open-modal-prenom">
                    <ion-label class="profile_label" position="stacked">Prénom</ion-label>
                    <b>{{$store.state.user.first_name}}</b>
                </ion-item>
                
            </ion-list>
            <ion-modal class="input-modal" trigger="open-modal-prenom">
                <ion-content>
                    <h1>Modifier le prénom</h1>
                    <ion-list inset="true">
                        <ion-item color="light">
                            <ion-label position="stacked">Prénom</ion-label>
                            <ion-input v-model="first_name"></ion-input>
                        </ion-item>
                    </ion-list>
                    <ion-button @click="updateProfile">Confirmer</ion-button>
                </ion-content>
            </ion-modal>
            <ion-list inset="true" button="true" mode="ios">
                <ion-item lines="none" color="light" mode="ios" id="open-modal-nom">
                    <ion-label class="profile_label" position="stacked">Nom</ion-label>
                    <b>{{$store.state.user.last_name}}</b>
                </ion-item>
            </ion-list>
            <ion-modal class="input-modal" trigger="open-modal-nom">
                <ion-content>
                    <h1>Modifier le nom</h1>
                    <ion-list inset="true">
                        <ion-item color="light">
                            <ion-label position="stacked">Nom</ion-label>
                            <ion-input v-model="last_name"></ion-input>
                        </ion-item>
                    </ion-list>
                    <ion-button @click="updateProfile">Confirmer</ion-button>
                </ion-content>
            </ion-modal>
            <div class="ion-padding">
                <ion-button class="log_out_button" @click="LogOut" color="danger">Se déconnecter</ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import axios from 'axios';
import { pencil } from 'ionicons/icons';
import { IonPage, IonContent, IonChip, IonLabel, IonList, IonItem, IonModal, IonInput } from '@ionic/vue'
export default {
    name: 'ProfIle',
        components: {
            IonPage, IonContent, IonChip, IonLabel, IonList, IonItem, IonModal, IonInput
        },
        data() {
            return {
                pencil,
                first_name: '',
                last_name: '',
            }
        },
        methods: {
            async LogOut() {
                await this.$store.commit('removeUser')
                window.location.replace("/tabs/login")
            },
            updateProfile() {
                const formData = {}
                if(this.first_name != '') formData.first_name = this.first_name
                if(this.last_name != '') formData.last_name = this.last_name
                axios.patch('/v1/users/' + this.$store.state.user.id + '/', formData)
                .then(response => this.$store.commit('setUser', response.data))
            }
        }
}
</script>

<style>
.profile_pic {
    width:30vw;
    height:30vw;
    border-radius:50%;
}

.label_modify {
    font-size:0.9em;
}

.profile_label{
    max-height:20px !important;
}

.log_out_button {
    width:100%;
}

.input-modal {
    --width: 290px;
    --height: 250px;
    --border-radius: 8px;
}
</style>