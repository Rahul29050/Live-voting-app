<template>
  <div class="signup-container">
    <div class="signup-box" data-aos="flip-left">
      <h2 class="signup-heading">Sign Up</h2>
      <form @submit.prevent="signup">
        <div class="form-group">
          <label for="fullName" class="label">Full Name:</label>
          <input type="text" id="fullName" placeholder="Enter your name" v-model="user.fullname" class="input-field" required>
        </div>
        <div class="form-group">
          <label for ="email" class="label">Email:</label>
          <input type="email" id="email" placeholder="Enter your email" v-model="user.email" class="input-field" required>
        </div>
        <div class="form-group">
          <label for="password" class="label">Password:</label>
          <input type="password" id="password" placeholder="Enter your password" v-model="user.password" class="input-field" required>
        </div>
        <div class="form-group">
          <label for="confirmPassword" class="label">Confirm Password:</label>
          <input type="password" id="confirmPassword" placeholder="Confirm password" v-model="user.confirmPassword" class="input-field" required>
        </div>
        <button type="submit" class="signup-button">Sign Up</button>
      </form>
      <p class="login-link">Already have an account? <router-link to="/login" class="login-button">Login now</router-link></p>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { ref } from 'vue'; // Import ref

import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'Signup',
  setup() {
    const Toast = useToast();
    const user = ref({
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    const { login } = mapActions('auth', ['login']);

    const signup = () => {
      if (user.value.password !== user.value.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      console.log('Registering user:', user.value);

      axios
        .post('http://localhost:3000/register', user.value)
        .then((response) => {
          console.log('Registration response:', response);

          if (response.status === 201) {
            alert('Registration Successful');

            console.log('Logging in user:', user.value);

            login({
              email: user.value.email,
              password: user.value.password,
            });
          } else if (response.status === 204) {
            alert('Action successful (No Content)');
          } else {
            alert('Unexpected response status: ' + response.status);
          }
        })
        .catch((error) => {
          console.error('Registration error:', error);
          alert('Registration failed. Please try again.');
        });
    };

    return {
      user,
      signup,
      Toast,
    };
  },
};
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ccc;

}

.signup-box {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.signup-heading {
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

.signup-button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 18px;
}

.signup-button:hover {
  background-color: #0056b3;
}

.login-link {
  font-size: 16px;
  margin-top: 20px;
}

.login-button {
  color: #007BFF;
  text-decoration: underline;
  cursor: pointer;
}

.login-button:hover {
  color: #0056b3;
}
</style>
