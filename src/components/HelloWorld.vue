<template>
  <div>
    <div v-for="(message, index) in messages" :key="index">
      <div style="display: flex; justify-content: center">
        <div style="margin-right: 20px">
          {{message.user.first_name}} {{message.user.last_name}} : {{ message.text }}
        </div>
        <div style="color: red" @click="deleteMessage(message.id)">
          Supprimer
        </div>
        <div style="color: blue; margin-left: 20px" @click="prepareEditText(index)">
          Editer
        </div>
      </div>
    </div>
    <div style="color: green" v-if="writingUser">
      {{writingUser.first_name}} {{writingUser.last_name}} est en train d'écrire ...
    </div>
    <input v-model="text"/>
    <button @click="sendMessage"> Send message</button>
    {{editing}}
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },

  data() {
    return {
      connection: null,
      text: null,
      actualMessageId: null,
      messages: [],
      writingUser: null,
      timer: null,
      editing: false,
    }
  },

  watch: {
    text(){
      this.testWriting()
    }
  },

  async mounted() {

    this.messages = (await axios.get(`http://127.0.0.1:8000/v1/messages/?conversation=4591d6ef-9943-40a0-8f9e-f789ccacf006&expand=user`)).data
    console.log(this.messages)

    this.connection = new WebSocket('ws://127.0.0.1:8000/ws/conversation/4591d6ef-9943-40a0-8f9e-f789ccacf006/')

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
          conversation: "4591d6ef-9943-40a0-8f9e-f789ccacf006",
          user: 1,
        }))
      }else{
        this.connection.send(JSON.stringify({
          type: 'edit',
          id: this.actualMessageId,
          text: this.text,
          conversation: "4591d6ef-9943-40a0-8f9e-f789ccacf006",
          user: 1,
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
        user: 1
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
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
