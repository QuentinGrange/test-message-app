<template>
    <ion-page>

      <ion-toolbar class="myContentTop">
      </ion-toolbar>
      <ion-content>
    <div class="ion-text-center">
        <h1>Conversations</h1>
        <ion-list>
            <ion-item routerDirection="forward" @click="$router.push('/Conv/' + conv.id)" v-for="conv in conversations" :key="conv">
                
                <ion-avatar class="avatar_conv">
                    <img src="../assets/avatar.png">
                </ion-avatar>{{conv.name}}
            </ion-item>
        </ion-list>
    </div>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button id="newConvModal" class="add-button">
        <ion-icon :icon="addOutline"></ion-icon>
    </ion-fab-button>
    </ion-fab>
    <ion-modal  mode="ios" :initialBreakpoint="1" :swipe-to-close="true" :presentingElement="$parent.$refs.ionRouterOutlet" trigger="newConvModal">
        <ion-content>
            <ion-list>
                <div v-for="user in users" :key="user">
                <ion-item v-if="user.id != $store.state.user.id" >
                    
                        <ion-label>{{user.first_name}}</ion-label>
                        <ion-checkbox v-model="user.selected"
                            slot="end">
                        </ion-checkbox>
                    
                </ion-item>
                </div>
            </ion-list>

            <ion-footer class="newConvModal-footer">
                <ion-button @click="createConv">Envoyer un message</ion-button>
            </ion-footer>
        </ion-content>
    </ion-modal>
      </ion-content>
    </ion-page>
</template>

<script>
import {openOutline, addOutline } from 'ionicons/icons'
import {IonPage, IonContent, IonToolbar, IonFab, IonFabButton, IonModal, IonCheckbox, IonFooter, IonButton, modalController } from '@ionic/vue'
import axios from 'axios'
    export default {
        name: 'NavBar',
        components:{
            IonPage, IonContent, IonToolbar, IonFab, IonFabButton, IonModal, IonFooter, IonButton, IonCheckbox
        },
        data() {
        return {
            openOutline, addOutline,
            conversations: [],
            users: []
        }
        },
        async mounted() {
            console.log(this.$store.state.user)
            await axios.get("/v1/conversations/?users=" + this.$store.state.user.id)
            .then(response => {
                console.log(response)
                this.conversations = response.data.reverse()
            })

            await axios.get("/v1/users/")
            .then((response) => {
                console.log(response)
                this.users = response.data
            })
        },
        methods: {
            newConvModal() {
                console.log("ok ")
            },
            async closeModal() {
                await modalController.dismiss()	
            },
            async createConv() {
                const selectedUsers = this.users.filter(user => {return user.selected})
                console.log(selectedUsers)

                const selectedIds = selectedUsers.map(el => el.id)
                selectedIds.push(this.$store.state.user.id)
                let listNames = selectedUsers[0].first_name
                for(let i = 1; i < selectedUsers.length; i++)
                {
                    listNames += ", " + selectedUsers[i].first_name
                }
                listNames += ", " + this.$store.state.user.first_name
                await axios.post("/v1/conversations/", {
                        "name": listNames,
                        "users": selectedIds
                    })
                .then(async response => {
                    console.log(response)

                    await axios.get("/v1/conversations/?users=" + this.$store.state.user.id)
                    .then(response => {
                        console.log(response)
                        this.conversations = response.data.reverse()
                    })

                    await axios.get("/v1/users/")
                    .then((response) => {
                        console.log(response)
                        this.users = response.data
                    })
                    await this.closeModal()
                    this.$router.push("/Conv/" + response.data.id)
                })
            }
        }
    }
</script>

<style>

.newConvModal-footer {
    position:fixed;
    bottom:0;
    z-index:10;
}

.avatar_conv {
    width:75px;
    height:75px;
}
</style>