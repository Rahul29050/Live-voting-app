<template>
  <div class="landing-page">
    <div class="heading" >
      <h1 class="custom-heading">Welcome to Real-Time Interactive Democracy</h1>
    </div>

    <div class="content">
      <div class="left-content">
          <img  src="../assets/images/Polls.gif" alt="Description of the image" class="landing-image" data-aos="flip-right" >
        <p>
          "Empowering Voices, Shaping Tomorrow: Join our Real-Time Polling System and engage in the democratic process like never before. Share your opinions, cast your votes, and drive positive change with just a click."
        </p>
      </div>

      <div class="button-container">
        <router-link to="/login" class="login-button">Login</router-link>
        <router-link to="/signup" class="signup-button">Signup</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>

.custom-heading {
  font-family :Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 28px; 
  font-weight: bold; 
  color: #333; 
}
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background-color: #A9C9FF;
  background-image: linear-gradient(180deg, #A9C9FF 0%, #FFBBEC 100%);
;
}

.heading {
  text-align: center;
  margin-bottom: 20px;
}

.heading h1 {
  font-size: 36px;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 800px; 
  width: 100%;
}

.left-content {
  text-align: center;
  margin-bottom: 20px;
}

.landing-image {
  margin-top: 40px;
  margin-bottom: 40px;
  max-width: 55%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

[data-aos="flip-right"] {
  transform: perspective(1000px) rotateY(180deg);
}

.flip-fade-enter-active,
.flip-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.flip-fade-enter, .flip-fade-leave-to  {
  opacity: 0;
  transform: rotateY(180deg);
}

.left-content p {
  font-size: 18px;
  color: #000000;
  margin-top: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.login-button,
.signup-button {
  display: inline-block;
  padding: 12px 24px;
  margin: 0 10px; 
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.login-button:hover,
.signup-button:hover {
  background-color: #0056b3;
}
</style>


