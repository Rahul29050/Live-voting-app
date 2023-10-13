<template>
  <div class="poll-details-container">
    <div v-if="poll" class="poll-card">
      <div :class="['time-left', { 'red-background': shouldShowRedBackground }]">
        <span class="label">Time Left:</span>{{ formatRemainingTime(countdown) }}
      </div>

      <h2>Poll Details</h2>
      <h3>{{ poll.question }}?</h3>
      <form>
        <ul class="options-list">
          <li v-for="(option, optionIndex) in poll.options" :key="optionIndex">
            <label @click="voteOption(option)"> <!-- Pass the entire option object -->
              <div :class="{ 'option-container': true, 'selected-option': selectedOption === option.option }">
                <input
                  type="radio"
                  :value="option.option"
                  v-model="selectedOption"
                  :disabled="hasVoted"
                  class="radio-button"
                />
                <div class="option-text"> {{ option.option }}</div>
                <div class="vote-percentage" v-if="hasVoted && poll.totalVotes > 0">
                  {{ calculatePercentage(option.option) }}%
                </div>
              </div>
            </label>
          </li>
        </ul>
        <hr>
      </form>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
     <router-link to="/dashboard" class="back-button">Back to Dashboard</router-link>
  </div>
</template>



<script>
import {
  calculateRemainingTime,
  formatRemainingTime,
} from "../compos/timeutils";
import {useToast} from 'vue-toastification';
import axiosInstance from "../utils/axiosinstance";



export default {
  data() {
    return {
      poll: null,
      selectedOption: null,
      hasVoted: false,
      countdown: 0,
      pollIsExpired: false,
    };
  },
  setup(){
    const Toast = useToast();
       return {Toast};
    },
  computed: {
    pollIsExpired() {
      return this.countdown <= 0;
    },
    shouldShowRedBackground() {
      return this.countdown !== "N/A" && this.countdown <= 300; 
    },
    totalVotes() {
      if (this.poll && this.poll.options) {
        return this.poll.options.reduce(
          (total, option) => total + option.votes,
          0
        );
      }
      return 0;
    },
  },
  created() {
    const pollId = this.$route.params.id;
    this.fetchPollDetails(pollId);

    this.$socket.on("pollUpdate", (updatedPoll) => {
      console.log("Received pollUpdate event:", updatedPoll);
      this.poll = updatedPoll;
    });

    const isRedBackgroundSet = localStorage.getItem(`redBackground${pollId}`);
    if (isRedBackgroundSet) {
      this.pollIsExpired = true;
    }
    this.startCountdownTimer();
  },
  methods: {
  
    calculateRemainingTime(poll) {
      return calculateRemainingTime(poll);
    },

    formatRemainingTime(remainingTime, durationUnit) {
      return formatRemainingTime(remainingTime, durationUnit);
    },

    async fetchPollDetails(pollId) {
      try {
        const response = await axiosInstance.get(`/api/polls/${pollId}`); // Use Axios for the GET request
        if (response.status === 200) {
          const poll = response.data;
          console.log("Fetched Poll Data:", poll);
          this.poll = poll;
        } else {
          console.error("Failed to fetch poll details:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching poll details:", error);
      }
    },

async voteOption(option) {
  if (this.pollIsExpired) {
    alert("This poll has ended, and no more votes can be cast.");
    return;
  }

  if (!this.hasVoted) {
    if (this.isVoting) {
      return;
    }

    this.isVoting = true;

    const pollId = this.$route.params.id;
    const optionId = option._id; 
    const postData = {
      pollId,
      optionId,
    };

      try {
          const response = await axiosInstance.post(`/api/vote`, postData, {
            headers: {
              "Content-Type": "application/json",
            },
          });

      if (response.status === 200) {
        this.selectedOption = option.option;
        this.hasVoted = true;
        this.Toast.success('Voted Successfully');
      } else {
        console.error('Failed to vote:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      this.isVoting = false;
    }
  }
},

    calculatePercentage(option) {
      if (this.totalVotes > 0) {
        const optionVotes = this.poll.options.find(
          (o) => o.option === option
        ).votes;
        return ((optionVotes / this.totalVotes) * 100).toFixed(2);
      }
      return 0;
    },
    startCountdownTimer() {
      this.timerInterval = setInterval(() => {
        if (this.poll) {
          this.countdown = this.calculateRemainingTime(this.poll);

          if (this.countdown <= 0) {
            this.pollIsExpired = true;

            const pollId = this.$route.params.id;
            localStorage.setItem(`redBackground${pollId}`, "true");
          }
        }
      }, 1000);
    },
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
};
</script>


<style scoped>
.poll-details-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #df96af;
  background-image: linear-gradient(0deg, #c994a6 0%, #869998 100%);
}

.poll-card {
  background-color: whitesmoke;
  position: relative;
  width: 70%;
  border: 1px solid #ccc;
  padding: 16px;
  margin: 16px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
  flex-direction: column;
}

.poll-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.options-form {
  margin-top: 20px;
}

.back-button {
  background-color: #007BFF;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  position: absolute;
  top: 30px;
  right: 30px;
}

.back-button:hover {
  background-color: #0056b3;
}

.radio-button {
    margin-right: 8px;
  }


.options-list {
  list-style: none;
  padding: 0;
}

.time-left {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #03ac24;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
}

.red-background {
  background-color: #fe0000;
}

.label {
  font-weight: bold;
  margin-right: 5px;
}

.poll-card h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
  text-align: left;
}

.poll-card h3 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: #555;
}

.poll-card ul {
  list-style-type: none;
  padding: 0;
}

.poll-card li {
  margin: 5px 0;
}

.option-label {
  margin-bottom: 10px;
}


.option-container {
  background-color: #fff;
  border: 3px solid #cccccc;
  padding: 10px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  width: 60vw;
  box-sizing: border-box; 
  border-radius: 4px;
  transition: border-color 0.3s, background-color 0.3s;
  flex-grow: 1;
}

.selected-option {
  border-color: #1bb622cf;
  background-color: #007bff;
}

.option-container:hover {
  background-color: #007bff8e; 
}

.option-text {
  justify-content: flex-start;
  color: #000000;
}

hr{
  margin-top:35px;
  margin-bottom: 30px;
}



.vote {
  border: 1px solid black;
  border-radius: 3px;
  background-color: #03ac24;
  margin-top: 20px;
}

.vote-percentage {
  font-weight: bold;
  margin-left: 10px;
  color: #007bff;
}
</style>