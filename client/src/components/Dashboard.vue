<template>
  <div class="dashboard" @poll-created="addNewPoll">
    <Navbar />
    <!-- <h1 @poll-created="addNewPoll"></h1> -->
    <div v-if="polls.length === 0">
      <p>No polls available</p>
    </div>
    <div v-else class="poll-cards-container">
      <div v-for="(poll, index) in polls" :key="index" class="poll-card">
        <div
          :class="[
            'time-left',
            { 'red-background': shouldShowRedBackground(poll._id) },
          ]"
        >
          <span class="label">Time Left : </span>
          <span
            v-if="!pollIsExpired(poll._id)"
            :class="
              formatRemainingTime(remainingTimes[poll._id], poll.durationUnit)
            "
          >
            {{
              formatRemainingTime(remainingTimes[poll._id], poll.durationUnit)
            }}
          </span>
          <span v-else>Expired</span>
        </div>

        <h2>{{ poll.question }}?</h2>
          <p class="created-by-bottom-right" v-if="poll.createdBy">
            Created by: {{ poll.createdBy.username }}
          </p>
            <ul class="bullet-list">
          <li v-for="(option, optionIndex) in poll.options" :key="optionIndex">
            {{ option.option }}
          </li>
        </ul>
          <router-link
            v-if="poll.isOpen && remainingTimes[poll._id] > 0"
            :to="'/poll/' + poll._id"
            v-bind:class="{ 'disabled-link': !poll.isOpen || remainingTimes[poll._id] <= 0 }"
            :disabled="!poll.isOpen || remainingTimes[poll._id] <= 0"
          >
            Access Live Poll
          </router-link>
        <span v-else class="poll-ended-message">Poll Duration Ended</span>
      </div>
    </div>
  </div>
</template>


<script>
import Navbar from "../compos/navbar.vue";
import {
  calculateRemainingTime,
  formatRemainingTime,
} from "../compos/timeutils";
import axiosInstance from "../utils/axiosinstance"

export default {
  props: ["id"],
  components: {
    Navbar,
  },
  data() {
    return {
      polls: [],
      remainingTimes: {},
      intervals: {},
    };
  },
  computed: {
 shouldShowRedBackground() {
    return (pollId) => {
      const remainingTime = this.calculateRemainingTime(
        this.polls.find((poll) => poll._id === pollId)
      );
      const shouldBeRed =
        remainingTime !== "N/A" &&
        remainingTime !== "Expired" &&
        remainingTime <= 300;

      const isRedBackgroundSet = localStorage.getItem(`redBackground${pollId}`);

      if (shouldBeRed && !isRedBackgroundSet) {
        localStorage.setItem(`redBackground${pollId}`, "true");
      }

      return shouldBeRed || isRedBackgroundSet;
    };
  },
},
  methods: {
    calculateRemainingTime(poll) {
      return calculateRemainingTime(poll);
    },

startCountdownTimers() {
  this.polls.forEach((poll) => {
    const remainingTime = this.calculateRemainingTime(poll);
    if (remainingTime !== "N/A") {
      if (remainingTime <= 0 || remainingTime === "Expired") {
        this.remainingTimes[poll._id] = "Expired";
        // this.updatePollStatus(poll._id);
        localStorage.setItem(`remainingTime${poll._id}`, "Expired");
      } else {
        this.remainingTimes[poll._id] = remainingTime;
        this.intervals[poll._id] = setInterval(() => {
          const remainingTime = this.calculateRemainingTime(poll);
          if (remainingTime <= 0 || remainingTime === "Expired") {
            clearInterval(this.intervals[poll._id]);
            this.remainingTimes[poll._id] = "Expired";
            // this.updatePollStatus(poll._id);
            localStorage.setItem(`remainingTime${poll._id}`, "Expired");
          } else {
            this.remainingTimes[poll._id] = remainingTime;
          }
        }, 1000);
      }
    }
  });
},

    formatRemainingTime(remainingTime, durationUnit) {
      return formatRemainingTime(remainingTime, durationUnit);
    },

    addNewPoll(newPoll) {
      console.log("New poll received:", newPoll);
      this.polls.push(newPoll);
      this.startCountdownTimers(); 
    },

 async fetchPolls() {
    try {
      this.polls = [];
      const response = await axiosInstance.get("http://localhost:3000/api/polls");
      if (response.status === 200) {
        this.polls = response.data;
        this.startCountdownTimers();
      } else {
        console.error(
          "Failed to fetch polls:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  },

  // async updatePollStatus(pollId) {
  //   try {
  //     const response = await axiosInstance.patch(
  //       `http://localhost:3000/api/polls/${pollId}/update-status`,
  //       { isOpen: false },
  //       { headers: { "Content-Type": "application/json" }
  //     });

  //     if (response.status === 200) {
  //       console.log(`Poll with ID ${pollId} status updated to false`);
  //     } else {
  //       console.error(
  //         "Failed to update poll status:",
  //         response.status,
  //         response.statusText
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error updating poll status:", error);
  //   }
  // },

  createPoll() {
    const postData = {
      question: this.poll.question,
      options: this.poll.options,
      visibility: this.poll.visibility,
    };

    axiosInstance.post("http://localhost:3000/api/polls", postData, {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status === 201) {
          console.log("Poll created with question:", response.data.poll.question);
          console.log("Options:", response.data.poll.options);

          this.addNewPoll(response.data.poll);
        } else {
          console.error("Failed to create poll:", response.status, response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error creating poll:", error);
      });


    this.closeCreatePollDialog();
  },

    logout() {
      this.$router.push("/");
      console.log("Logout button clicked");
    },
    pollIsExpired(pollId) {
      const remainingTime = this.calculateRemainingTime(
        this.polls.find((poll) => poll._id === pollId)
      );
      return remainingTime !== "N/A" && remainingTime <= 0;
    },
  },

created() {
  for (const poll of this.polls) {
    const storedRemainingTime = localStorage.getItem(
      `remainingTime${poll._id}`
    );

    if (this.shouldShowRedBackground(poll._id)) {
      const timerElement = document.querySelector(`#timer${poll._id}`);
      if (timerElement) {
        timerElement.classList.add("red-background");
      }
    }

    if (storedRemainingTime !== null && storedRemainingTime === "Expired") {
      this.remainingTimes[poll._id] = "Expired";
    }
  }

  this.fetchPolls();
},

  beforeDestroy() {
    for (const poll of this.polls) {
      localStorage.removeItem(`remainingTime${poll._id}`);
    }
  },
};
</script> 
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Onest:wght@800;900&display=swap');


.poll-cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px; 
}
.poll-card {
  position: relative;
  width: 70%;
  border: 1px solid #ccc;
  padding: 16px;
  margin: 16px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.poll-card:hover {
  transform: scale(1.05); 
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

  .bullet-list {
    list-style: none;
  }

  .bullet-list li::before {
    content: "\2022"; /* Unicode character for the bullet point symbol */
    margin-right: 5px; /* Adjust this value to control the spacing */
  }
  

.time-left {
  position: absolute;
  top: 10px; 
  right: 10px; 
  background-color: #43c522;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
}

.red-background {
  background-color: #fe0000;
}
.black-background {
  background-color: #000; 
}
.poll-ended-message {
  color: #ff0000; 
  font-weight: bold; 
  font-size: 18px;
  display: flex;
  justify-content: center;
}

.poll-card h2 {
  font-weight: 600;
  font-size: 28px;
  margin-bottom: 10px;
}

.poll-card ul {
  list-style-type: none;
  padding: 0;
}

.poll-card li {
  margin: 5px 0;
}

p {
  font-size: 36px;
  color: Red;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  margin: 10px;
  padding: 5px;
}

.created-by-bottom-right {
  position: absolute;
  bottom: -10px; /* Adjust this value as needed */
  right: 10px; /* Adjust this value as needed */
  color: #333; /* Change text color if needed */
  font-size: 16px; /* Adjust font size as needed */
}


.router-link-exact-active {
  color: #007bff;
  font-weight: bold;
}
</style>