<template>
  <div class="my-polls">
    <Navbar />

    <div class="my-polls-container">
      <div class="question-list">
        <h2 class="my-polls-title">Poll Title</h2>
        <ul>
          <li
            v-for="(poll, index) in polls"
            :key="index"
            @click="showPollDetails(poll)"
          >
            * {{ poll.question }}
            <span @click="confirmDelete(poll._id)" class="delete-icon"
              ><i class="fa-solid fa-trash" style="color: #ff0000"></i
            ></span>
          </li>
        </ul>
      </div>

      <div class="poll-details">
        <h2 class="my-polls-title">Poll Details</h2>

        <div v-if="selectedPoll">
          <div class="poll-card">
            <div class="poll-card-header">
              <h2>{{ selectedPoll.question }}</h2>
              <div class="poll-card-stats">
                <span class="poll-card-stat"
                  >Total Votes: {{ selectedPoll.totalVotes }}</span
                ><br />
                <span class="time-left" :style="{ color: timeLeftColor }"
                  >Time Left: {{ selectedPoll.timeLeft }}</span
                >
              </div>
            </div>

            <div class="poll-card-options">
              <ul class="bullet-list">
                <li
                  v-for="(option, optionIndex) in selectedPoll.options"
                  :key="optionIndex"
                >
                  <div class="option-slider">
                    <div class="option-text">{{ option.option }}</div>
                    <div class="option-percent">
                      {{ option.votePercentage.toFixed(2) }}%
                    </div>
                    <div class="vote-bar">
                      <div
                        :style="{ width: `${option.votePercentage}%` }"
                        class="vote-fill"
                      ></div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div v-else>
          <p>Please select a poll to view details.</p>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import Navbar from "../compos/navbar.vue";
import axiosInstance from "../utils/axiosinstance";
import {
  calculateRemainingTime,
  formatRemainingTime,
} from "../compos/timeutils";
import Swal from "sweetalert2";

export default {
  name: "MyPolls",

  components: {
    Navbar,
  },

  data() {
    return {
      polls: [],
      selectedPoll: null,
    };
  },

  async mounted() {
    this.fetchUserPolls();
    setInterval(this.updateRemainingTime, 1000);
  },

  computed: {
    timeLeftColor() {
      return this.selectedPoll && this.selectedPoll.timeLeft < 300
        ? "red"
        : "green";
    },
  },

  methods: {
    async fetchUserPolls() {
      try {
        const response = await axiosInstance.get(
          "http://localhost:3000/api/user/polls"
        );

        if (response.status === 200) {
          this.polls = response.data;
          this.updateRemainingTime();
        } else {
          console.error(
            "Failed to fetch user's polls:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user's polls:", error);
      }
    },

    async deletePoll(pollId) {
      try {
        const response = await axiosInstance.delete(`/api/polls/${pollId}`);

        if (response.status === 200) {
          this.polls = this.polls.filter((poll) => poll._id !== pollId);
       
          console.error(
            "Failed to delete poll:",
            response.status,
            response.statusText
          );   this.selectedPoll = null;
        } else {
        }
      } catch (error) {
        console.error("Error deleting poll:", error);
      }
    },

    async confirmDelete(pollId) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Deleting this poll will permanently remove it along with all associated information. Are you sure you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        this.deletePoll(pollId);
      }
    },

    updateRemainingTime() {
      this.polls.forEach((poll) => {
        poll.timeLeft = formatRemainingTime(
          calculateRemainingTime(poll),
          poll.durationUnit
        );
      });
    },

    showPollDetails(poll) {
      this.selectedPoll = poll;
      poll.totalVotes = poll.options.reduce(
        (total, option) => total + option.votes,
        0
      );

      this.selectedPoll.options = this.selectedPoll.options.map((option) => ({
        ...option,
        votePercentage:
          poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0,
      }));
    },
  },
};
</script>

<style>
.my-polls-container {
  display: flex;
  align-items: flex-start;
}

.question-list {
  width: 30%;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 16px;
}

.question-list ul {
  list-style-type: none;
  padding: 0;
}

.question-list li {
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 25px;
  margin-top: 15px;
  border-bottom: 1px solid #ccc;
}

.poll-details {
  width: 70%;
  padding: 16px;
}
.delete-icon {
  cursor: pointer;
  font-size: 1.4rem;
  margin-left: 10px;
  color: #e74c3c;
  float: right;
  transition: transform 0.2s ease-in-out;
}

.delete-icon:hover {
  color: #ff0000;
  transform: scale(1.2);
}

.poll-card {
  background-color: #ffffff;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.poll-card-stat {
  font-weight: 600;
}

.poll-card-options ul {
  list-style-type: none;
  padding: 0;
}

.poll-card-options li {
  padding: 8px 0;
  border-bottom: 1px solid #ccc;
}

.poll-card-footer {
  margin-top: 16px;
}

.option-text {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 5px;
}

.option-slider {
  display: flex;
  flex-direction: column;
  align-items: left;
  margin: 10px 0;
}

.animated-vote {
  margin-right: 10px;
}

.vote-bar {
  width: 100%;
  background: #ecf0f1;
  margin-top: 5px;
}

.vote-fill {
  height: 20px;
  background: #3498db;
  transition: width 2s;
}

.time-left {
  text-align: right;
  color: white;
  font-weight: bold;
}

@media (max-width: 500px) {
  .my-polls-container {
    flex-direction: column;
  }
  .question-list {
    width: 100%;
  }

  .poll-details {
    width: 100%;
  }

  .poll-card {
    width: 100%;
  }
}
</style>
