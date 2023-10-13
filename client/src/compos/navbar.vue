<template>
  <div class="navbar">
    <div class="navbar-left">
      <h3>Polling Application</h3>
    </div>

    <div class="navbar-right">
      <button class="dashboard-button" @click="dashboard">Dashboard</button>
      <button class="my-polls-button" @click="mypolls">My Polls</button>
      <button class="create-poll-button" @click="openCreatePollDialog">
        Create Poll
      </button>
      <button class="logout-button" @click="logout">Logout</button>
    </div>

    <a-modal
      v-model:open="showCreatePollDialog"
      width="1000px"
      title="Create Poll"
      @ok="createPoll"
      @cancel="closeCreatePollDialog"
    >
      <div class="create-poll-dialog-content">
        <div class="input-group">
          <label for="question">Question:</label>
          <input
            v-model="poll.question"
            id="question"
            type="text"
            placeholder="Enter your question here..."
            required
          />
        </div>

        <div class="options-and-details">
          <div class="options-container">
            <label for="options" class="optionss">Options:</label>
            <div class="input-group">
              <div class="options-list">
                <div
                  v-for="(option, index) in displayedOptions"
                  :key="index"
                  class="option"
                >
                  <div class="option-content">
                    <label :for="'option' + index" class="numbering"
                      >{{ index + 1 }}
                    </label>
                    <input
                      v-model="poll.options[index]"
                      :id="'option' + index"
                      type="text"
                      class="option-input"
                      placeholder="Options..."
                      required
                    />
                    <span
                      class="remove-option"
                      @click="removeOption(index)"
                      v-if="index >= 2"
                      >❌</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <button
              class="add-option-button"
              @click="addOption"
              :disabled="displayedOptions.length >= 5"
            >
              Add Option
            </button>
          </div>

          <div class="duration-visibility-container">
            <div class="input-group">
              <label for="duration">Duration:</label>
            </div>
            <div class="input-group">
              <input
                v-model="poll.duration"
                id="duration"
                type="number"
                min="1"
                placeholder="Enter Duration..."
                required
              />
            </div>
            <div class="input-group">
              <select v-model="poll.durationUnit" required id="duration-unit">
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>

            <label for="visibility" style="margin-top: 20px">Visibility:</label>
            <div class="visibility-options">
              <label for="private">Private</label>
              <input
                v-model="poll.visibility"
                id="private"
                name="visibility"
                type="radio"
                value="private"
                required
              />
            </div>
            <div class="visibility-options">
              <label for="public">Public</label>
              <input
                v-model="poll.visibility"
                id="public"
                name="visibility"
                type="radio"
                value="public"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>


<script>
import { ref, computed } from "vue";
import { Modal, Button } from "ant-design-vue";
import { useRouter } from "vue-router";
import io from "socket.io-client";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
import axiosInstance from "../utils/axiosinstance";

export default {
  setup() {
    const Toast = useToast();
    const store = useStore();
    const showCreatePollDialog = ref(false);
    const router = useRouter();
    const user = store.state.user;
    console.log(user);
    const poll = {
      question: "",
      options: ["", ""],
      visibility: "public",
      duration: "",
      durationUnit: "minutes",
      isActive: true,
    };
    const additionalOptions = ref(0);

    const openCreatePollDialog = () => {
      showCreatePollDialog.value = true;
      console.log("Modal opened");
    };

    const closeCreatePollDialog = () => {
      showCreatePollDialog.value = false;
    };

    const addOption = () => {
      if (additionalOptions.value < 5) {
        additionalOptions.value++;
      } else {
        alert("You can only add up to 5 options.");
      }
    };

    const removeOption = (index) => {
      if (index >= 2) {
        poll.options.splice(index, 1);
        additionalOptions.value--;
      }
    };

    const displayedOptions = computed(() =>
      poll.options.concat(new Array(additionalOptions.value).fill(""))
    );

      const currentUser = store.state.user;
      console.log(currentUser);
    const createPoll = () => {
      const postData = {
        question: poll.question,
        options: poll.options,
        visibility: poll.visibility,
        duration: parseInt(poll.duration),
        durationUnit: poll.durationUnit,
        isActive: true,
        createdBy: {
          userId:currentUser._id,
          username:currentUser.fullname,
        },
      };

      const durationInSeconds = convertDurationToSeconds(
        poll.duration,
        poll.durationUnit
      );

      postData.isActive = false;

      axiosInstance
        .post("http://localhost:3000/api/polls", postData)
        .then((response) => {
          if (response.status === 201) {
            
            const socket = io("http://localhost:3000");
            socket.emit("newPollCreated", postData);

            closeCreatePollDialog();
            window.location.reload();
            console.log(postData);
            Toast.success("Poll created Successfully");
          } else {
            console.error(
              "Failed to create poll:",
              response.status,
              response.statusText
            );
          }
        })
        .catch((error) => {
          console.error("Error creating poll:", error);
        });

      const socket = io("http://localhost:3000");
      socket.emit("newPollCreated", postData); // Emit the data, not data.poll

      closeCreatePollDialog();
    };

    const logout = () => {
      store.dispatch("logout");
      router.push({ name: "LandingPage" });
      Toast.error("Logout Successfully");
      console.log("Logout button clicked");
    };

    const dashboard = () => {
      router.push({ name: "Dashboard" });
    };

    const mypolls = () => {
      router.push({ name: "mypolls" });
    };

    function convertDurationToSeconds(duration, unit) {
      switch (unit) {
        case "minutes":
          return duration * 60;
        case "hours":
          return duration * 60 * 60;
        case "days":
          return duration * 60 * 60 * 24;
        default:
          return 0;
      }
    }

    return {
      showCreatePollDialog,
      poll,
      additionalOptions,
      openCreatePollDialog,
      closeCreatePollDialog,
      addOption,
      removeOption,
      displayedOptions,
      createPoll,
      logout,
      dashboard,
      mypolls,
      Toast,
    };
  },
  components: {
    "a-modal": Modal,
    "a-button": Button,
  },
};
</script>


 
<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #a02467;
  background-image: linear-gradient(
    225deg,
    #a02467 0%,
    #784ba0 50%,
    #397cae 100%
  );
  color: #fff;
}

.navbar-left img {
  max-height: 40px;
}

.create-poll-button,
.logout-button {
  background: transparent;
  padding: 10px 20px;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-poll-button:hover,
.logout-button:hover {
  background-color: #007bff;
  color: #fff;
}
.dashboard-button,
.my-polls-button {
  background: transparent;
  padding: 10px 20px;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dashboard-button:hover,
.my-polls-button:hover {
  background-color: #007bff;
  color: #fff;
}
.create-poll-dialog-content {
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.input-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

#question {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 16px;
}

.optionss {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 15px;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.option-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.option-input {
  /* flex: 1; */
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 350px;
  font-size: 16px;
}

.remove-option {
  cursor: pointer;
  margin-left: 10px;
  font-size: 24px;
  color: #ff6347;
}

.add-option-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.add-option-button:hover {
  background-color: #0056b3;
}

/* Style the Duration input field */
.duration-input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

#duration {
  flex: 1;
  width: 80px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 20px;
  font-size: 16px;
}

#duration-unit {
  flex: 1;
  width: 80px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

.duration-visibility-container {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  padding: 20px;
}

/* Style the Visibility radio buttons */
.visibility-options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
}

.visibility-options label {
  font-weight: normal;
  margin-right: 10px;
  font-size: 18px;
}

input[type="radio"] {
  margin-right: 10px;
  font-size: 16px;
}

.options-and-details {
  display: flex;
  flex-direction: row;
}

.options-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.numbering {
  margin-right: 2%;
}

.duration-visibility-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  padding: 20px;
}

.duration-visibility-container .input-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.duration-visibility-container label {
  margin-bottom: 10px;
}

.duration-visibility-container input[type="radio"] {
  margin-right: 10px;
  font-size: 16px;
}

.visibility-options input[type="radio"] {
  margin-right: 10px;
  font-size: 18px;
}

.el-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>