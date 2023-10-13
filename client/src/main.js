import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
 import store from './store/store'
import io from 'socket.io-client';

const socket = io("http://localhost:3000");
socket.emit("testEvent", "Hello, server!");

socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });

const app = createApp(App);
app.config.globalProperties.$socket = socket;
app.use(router);
 app.use(store);
app.use(Toast);
app.mount('#app');

AOS.init();

export { socket };

