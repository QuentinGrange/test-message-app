<template>

    <ion-page class="ion-padding">

      <ion-toolbar  class="myContentTop">
      </ion-toolbar>
        <ion-content>
    <div v-if="choice == 'login'" class="LogIn">
      <ion-toolbar  class="myContentTop">
      </ion-toolbar>
        <h1 class="ion-text-left">Bienvenue,</h1>
        <h4>Connecte toi pour continuer ! </h4>
                   
        <form @submit.prevent="submitFormLogin">
            
            <div class="form-group row">
                <ion-item class="ion-no-padding"  lines="none">
                    <input type="text" placeholder="Username" v-model="username"/>
                </ion-item>
            </div>
                       
            <div class="form-group2 row">
                <ion-item class="ion-no-padding" lines="none">
                    <input type="password" placeholder="Mot de passe" v-model="password"/>
                </ion-item>
            </div>
            <div class="form-group row">
                    <ion-button type="submit">Se connecter</ion-button>
            </div>
        </form>


        <p class="gotosignup" @click="() => {choice = 'signup'}">Vous n'avez pas de compte ? <b>Inscrivez-vous</b></p>
    </div>

    <div v-if="choice == 'signup'" class="SignUp">
      <ion-toolbar  class="myContentTop">
      </ion-toolbar>
        <h1 class="ion-text-left">Bienvenue,</h1>
        <h4>Inscris-toi pour continuer ! </h4>
                   
        <form @submit.prevent="submitFormSignUp">
            
            <div class="form-group row">
                <ion-item class="ion-no-padding"  lines="none">
                    <input type="text" placeholder="Username" v-model="username"/>
                </ion-item>
            </div>

            <div class="form-group row">
                <ion-item class="ion-no-padding"  lines="none">
                    <input type="text" placeholder="Prénom" v-model="first_name"/>
                </ion-item>
            </div>
                       

            <div class="form-group row">
                <ion-item class="ion-no-padding"  lines="none">
                    <input type="text" placeholder="Nom" v-model="last_name"/>
                </ion-item>
            </div>
                       
            <div class="form-group row">
                <ion-item class="ion-no-padding" lines="none">
                    <input type="password" placeholder="Mot de passe" v-model="password"/>
                </ion-item>
            </div>    
            <div class="form-group2 row">
                <ion-item class="ion-no-padding" lines="none">
                    <input type="password" placeholder="Mot de passe (2)" v-model="password2"/>
                </ion-item>
            </div>
            <div class="form-group row">
                    <ion-button type="submit">S'inscrire</ion-button>
            </div>
        </form>


        <p class="gotosignup" @click="() => {choice = 'login'}">Vous avez déjà un compte ? <b>Connectez-vous</b></p>
    </div>
    </ion-content>
    </ion-page>
    
</template>

<script>

import axios from 'axios'
import { IonToolbar, loadingController, toastController, IonContent, IonItem, IonButton, IonPage } from '@ionic/vue'
import { Storage } from '@capacitor/storage';
export default {
    name: 'LogIn',
    components: {
        IonItem, IonButton, IonPage, IonToolbar, IonContent,
    },
    data() {
        return {
            username: '',
            errors: [],
            password: '',
            password2: '',
            first_name: '',
            last_name: '',
            failed: '',
            choice: 'login',
            loading: null
        }
    },
    created() {
        console.log(this.choice)
    },
    methods: {
        async presentLoading() {
            this.loading = await loadingController
            .create({
                cssClass: 'my-custom-class',
                message: 'Merci de patienter...',
                mode: 'ios'
            });
            
            await this.loading.present();
        },
		async openToast() {
			const toast = await toastController
				.create({
				message: this.errors,
				duration: 3000,
				color: 'danger',
                position: 'middle'
				})
			return toast.present();
		},
		async openToastSuccess() {
			const toast = await toastController
				.create({
				message: "Compte créé avec succès ! Vous pouvez désormais vous connecter",
				duration: 3000,
				color: 'success',
                position: 'middle'
				})
			return toast.present();
		},
        async submitFormLogin() {

            await this.presentLoading()
            this.errors = []
            await Storage.remove({key:"token"})

            if(this.username == '') {
                this.errors.push('Renseignez un username')
            }

            if(this.password == '') {
                this.errors.push("Renseignez un mot de passe.")
            }

            if(!this.errors.length) {
                const formData = {
                    username : this.username.toLowerCase(),
                    password : this.password,
                }

                await axios
                .post("/v1/auth/token/", formData)
                .then(async (response) => {
                    console.log(response)

                    await Storage.set({key: "access_token", value: response.data.access})
                    await Storage.set({key: "refresh_token", value: response.data.refresh})
                    axios.get("/v1/users/", {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + response.data.access
                    }) 
                    .then((response) => {
                        this.loading.dismiss()
                        console.log(response)
                        this.$store.commit('setUser',(response.data.find(user => user.username.toLowerCase() == this.username.toLowerCase())))
                        console.log(this.$store.state.user)
                        this.$router.push('/tabs/Profile')
                    })
                })
                .catch(async error => {

                    await this.loading.dismiss();

                    console.log(error)
                    if (error.response){
                        for (const property in error.response.data) {
                            if(error.response.data[property] == "Unable to log in with provided credentials.") {
                                this.errors.push('Identifiant ou mot de passe incorrect.')
                                this.openToast()
                            }
                        }
                    }
                    else {
                        this.errors.push(error)
                        this.openToast()
                    }
                })
            }

            else {

                await this.loading.dismiss();

                this.openToast()
            }
        },
        async submitFormSignUp() {

            await this.presentLoading()
            this.errors = []

            if(this.username == '') {
                this.errors.push('Renseignez un username')
            }

            if(this.password == '') {
                this.errors.push("Renseignez un mot de passe.")
            }

            if(!this.errors.length) {
                const formData = {
                    username : this.username.toLowerCase(),
                    password : this.password,
                    first_name : this.first_name,
                    last_name: this.last_name
                }

                await axios
                .post("/v1/auth/register/", formData)
                .then(async (response) => {
                    await this.loading.dismiss();
                    this.openToastSuccess()
                    console.log(response)
                })
                .catch(async error => {
                    await this.loading.dismiss();
                    console.log(error)
                })
            }

            else {

                await this.loading.dismiss();

                this.openToast()
            }
        }
    }
}
</script>

<style scoped>


.form-group {
    padding-bottom:20px;
}

.form-group2 {
    padding-bottom:45px;
}


  label {
    position: absolute;
    left: 1rem;
    top: 0.8rem;
    padding: 0 0.25rem;
    color: #a9a9a9;
    font-size: 17px;
    font-weight:600;
    transition: 0.3s;
  }
input {
    height: 100%;
    width: 100%;
    font-size: 17px;
    font-weight:600;
    border: 2px solid #e7ebee;
    border-radius: 10px;
    z-index:1;
    color:#171c25;
    --placeholder-color:#a9a9a9;
    padding-left: 20px;
}

b {
    color:#070c9b;
}

input:focus {
    border-color:#070c9b;
    outline:none;
}

ion-button {
    width:100%
}

.forgot {
    float:right;
    color:black;
    font-weight: 500;
    font-size:0.8em;
    padding-bottom:10%;
}

form {
    padding-top:20%;
}

.gotosignup {
    font-weight: 600;
    text-align: center;
    margin-top:14vh;
    color:#a9a9a9;
}

h1 {
    font-weight: 600;
}

h4 {
    color:grey;
}
</style>