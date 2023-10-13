<template>
  <div class="login-container">
    <div class="login-box" data-aos="flip-right">
      <h2 class="login-heading">Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email" class="label">email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" v-model="userData.email" class="input-field" required>
        </div>
        <div class="form-group">
          <label for="password" class="label">Password:</label>
          <input type="password" id="password" placeholder="Enter your password" v-model="userData.password" class="input-field" required>
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <p class="signup-link">Don't have an account? <router-link to="/signup" class="signup-button">Sign up now</router-link></p>
    </div>
  </div>
</template>

<script>import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {useToast} from 'vue-toastification';


export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore();
    const router = useRouter();
    const Toast = useToast();
    const userData = ref({
      email: '',
      password :'',
    });
    

const login = async () => {
  console.log('login hit');
  try {
    const response = await store.dispatch('login', userData.value);
    console.log(response);
    if (response && response.user ) { 
      const token = response.token; 
      // const user = response.user;
      router.push('/dashboard');

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.user));
      Toast.success("Login Successfully");
    }
  } catch (error) {
    console.log(error)
    Toast.error("Invalid Credentials", error);
  }
};
    return {
      userData,
      login,
      Toast
    };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ccc;
}

.login-box {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.login-heading {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  font-size: 18px;
  font-weight: bold;
  color: #555;
  display: block;
  text-align: left;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.login-button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 18px;
}

.login-button:hover {
  background-color: #0056b3;
}

.signup-link {
  font-size: 16px;
  margin-top: 20px;
}

.signup-button {
  color: #007BFF;
  text-decoration: underline;
  cursor: pointer;
}

.signup-button:hover {
  color: #0056b3;
}
</style>
