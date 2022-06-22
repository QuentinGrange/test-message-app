<template>
  <ion-page>
	
	<ion-header>
		<ion-toolbar class="white-toolbar">
		<ion-title :key="conversation">{{conversation.name}}</ion-title>
			<ion-buttons slot="start">
				<ion-back-button text="" default-href="/tabs/ConversationList"></ion-back-button>
			</ion-buttons>
		</ion-toolbar>

	<div class="ion-text-center">
		<div class="img_cont">
			<img src="../assets/avatar.png" class="rounded-circle user_img">
			<span class="online_icon"></span>
		</div>
		<div class="user_info">
			<p>{{messages.length}} Messages</p>

      <div style="color: green" v-if="writingUser && writingUser.id != $store.state.user.id">
        {{writingUser.first_name}} {{writingUser.last_name}} est en train d'écrire ...
      </div>
		</div>
	</div>
    </ion-header>

	<ion-content>
				<div class="conv-content" ref="chat">
					<ion-item lines="none" v-for="message, index in messages" :key="index">
						<div class="d-flex ion-justify-content-start mb-2" v-if="message.user.id != $store.state.user.id" slot="start">
							<ion-avatar>
								<img src="../assets/logo.png" class="rounded-circle user_img_msg">
							</ion-avatar>
							<ion-badge class="msg_cotainer msg-badge">
								<div class="msg-text">{{message.text}}</div>
								<span class="msg_time">{{new Date(message.date_sent).toLocaleString().slice(0,17)}}</span>
							</ion-badge>
						</div>
						<div v-else class="d-flex ion-justify-content-end mb-2" slot="end">
							<ion-badge class="msg_cotainer_send msg-badge">
								<div class="msg-text">{{message.text}}</div>
								<span class="msg_time_send">{{new Date(message.date_sent).toLocaleString().slice(0,17)}}</span>
							</ion-badge>
							<ion-avatar>
								<img src="../assets/logo.png" class="rounded-circle user_img_msg">
							</ion-avatar>
						</div>
					</ion-item>
				</div>
	</ion-content>
	<ion-footer class="conv-footer">
		<ion-toolbar>
		<ion-row class="mw-100 m-0">
		<ion-col class="p-0">
			<ion-textarea name="" no-resize class="form-control type_msg" v-model="text" placeholder="Type your message..."></ion-textarea>
		</ion-col>
		<ion-col size=3 class="ion-text-center ion-justify-content-center ion-align-self-center">
			<ion-icon @click="sendMessage" :icon="send" :style="msg == '' ? 'opacity:0.5' : ''"></ion-icon>
		</ion-col>
		</ion-row>
		</ion-toolbar>
	</ion-footer>
  </ion-page>
</template>

<script>

import axios from 'axios'
import { IonBadge, IonButtons, IonBackButton, IonPage, IonToolbar, IonHeader, IonContent, IonRow, IonCol, IonIcon, IonTextarea } from '@ionic/vue'
import { send } from 'ionicons/icons';
export default {
  name: 'HelloWorld',
  components: {
     IonBadge, IonButtons, IonBackButton, IonPage, IonToolbar, IonHeader, IonContent, IonRow, IonCol, IonIcon, IonTextarea 
  },

  data() {
    return {
      send,
      connection: null,
      text: null,
      actualMessageId: null,
      messages: [],
      conversation: {},
      writingUser: null,
      timer: null,
      editing: false,
      id: '',
      interlocutor: {}
    }
  },

  watch: {
    text(){
      this.testWriting()
    }
  },

  async mounted() {
    this.id = this.$route.params.id
    this.messages = (await axios.get(`http://127.0.0.1:8000/v1/messages/?conversation=` + this.id + `&expand=user`)).data
	this.conversation = (await axios.get("/v1/conversations/" + this.id + "/")).data
    console.log(this.messages)

    this.connection = new WebSocket('ws://127.0.0.1:8000/ws/conversation/' + this.id + '/')

    this.connection.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if(data.type === 'create'){
        this.messages.push(data)
      }else if(data.type === 'delete'){
        this.$delete(this.messages, this.messages.findIndex(message => message.id === data.id))
      } else if(data.type === 'writing'){
        this.writingUser = data.user
      } else if(data.type === 'writing_end'){
        this.writingUser = null
      } else if(data.type === 'edit'){
        this.messages[this.messages.findIndex(message => message.id === data.id)].text = data.text
      }

      this.$forceUpdate()
    }

    this.connection.onclose = (e) => {
      console.log('error', e)
    }
  },

  methods: {
    sendMessage() {
      if(!this.editing){
        this.connection.send(JSON.stringify({
          type: 'create',
          text: this.text,
          conversation: this.id,
          user: this.$store.state.user.id,
        }))
      }else{
        this.connection.send(JSON.stringify({
          type: 'edit',
          id: this.actualMessageId,
          text: this.text,
          conversation: this.index,
          user: this.$store.state.user.id,
        }))
      }
      this.editing = false
      this.text = null
    },

    prepareEditText(index){
      this.text = this.messages[index].text
      this.actualMessageId = this.messages[index].id
      this.editing = true
    },

    deleteMessage(id) {
      this.connection.send(JSON.stringify({
        type: 'delete',
        id: id
      }))
    },

    testWriting(){
      this.isWriting()

      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.writingEnd();
      }, 500);
    },

    isWriting(){
      this.connection.send(JSON.stringify({
        type: 'writing',
        user: this.$store.state.user.id
      }))
    },

    writingEnd(){
      this.connection.send(JSON.stringify({
        type: 'writing_end',
      }))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .card-footer{
        border-radius: 25px !important;
        padding:0px;
        height:10%;
    }

    .user_img{
        height: 70px;
        width: 70px;
        border:1.5px solid #f5f6fa;
		object-fit:cover;
    }
    .user_img_msg{
        height: 40px!important;
        width: 40px!important;
        min-height: 40px!important;
        min-width: 40px!important;
        border:1.5px solid #f5f6fa;
		object-fit: cover;
    }
	.msg_cotainer{
		margin-top: auto;
		margin-bottom: auto;
		margin-left: 5px;
		border-radius: 25px;
		background-color: #78e08f;
		max-width:80%;
		padding: 10px;
		position: relative;
	}
	.msg_cotainer_send{
		margin-top: auto;
		margin-bottom: auto;
		margin-right: 5px;
		border-radius: 25px;
		background-color: #0a4739;
		max-width:80%;
		padding: 10px;
		position: relative;
	}
	.msg_time{
		position: absolute;
		left: 0;
		bottom: -15px;
		color: rgba(255,255,255,0.5);
		font-size: 10px;
		white-space: nowrap;
	}
	.msg_time_send{
		position: absolute;
		right:0;
		bottom: -15px;
		color: rgba(255,255,255,0.5);
		font-size: 10px;
		white-space: nowrap;
	}
	.user_info{
		margin-top: auto;
		margin-bottom: auto;
		margin-left: 15px;
	}
	.user_info span{
		font-size: 20px;
	}
	.user_info p{
	font-size: 10px;
	}

    .card-body{
        padding:0px;
    }

    .msg_card_body{
        padding:0px;
        overflow-y: auto;
        height:75%;
    }

	.rounded-circle {
		border-radius: 50%!important;
	}

	.d-flex {
		display: flex !important;;
	}

	.mb-4 {
		margin-bottom: 1.5em !important;
	}

	.closeButton {
		--background: transparent;
		position: fixed;
		top:calc(env(safe-area-inset-top)/2);
		left:0;
		--color:#0a4739;
		z-index: 1000;
		font-size: 1.3em;
		--background-activated:transparent;
	}


	.msg-text {
		margin:0;
		white-space: pre-line;
		text-align:left;
	}

	.conv-footer {
		
		position:fixed;
		bottom:0;
		background-color:#F8F8F8;
		height:calc(8vh + env(safe-area-inset-bottom));
		z-index:100;

	}

  .conv-footer ion-toolbar {
			padding:0;
			padding-top:0px !important;
		}
  .conv-footer ion-icon {
			background-color:#78e08f;
			padding: 15px;
			border-radius:50%;
			color:white;
			font-size:1.4em !important;
  }

	.white-toolbar {
		--background:white;
		--border-width: 0 0 0 0 !important;
	}
</style>
