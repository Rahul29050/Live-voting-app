<template>
  <div class="my-polls">
    <Navbar />

    <h1 class="my-polls-title">My Polls</h1>

    <div v-if="polls.length === 0">
      <p>No polls available</p>
    </div>

    <div v-else class="poll-cards-container">
      <div v-for="(poll, index) in polls" :key="index" class="poll-card">
        <div class="poll-card-header">
          <h2>{{ poll.question }}</h2>
          <div class="poll-card-stats">
            <span class="poll-card-stat">Total Votes: {{ poll.totalVotes }}</span>
            <span class="poll-card-stat">Time Left: {{ poll.timeLeft }}</span>
          </div>
        </div>

        <div class="poll-card-options">
          <ul class="bullet-list">
            <li v-for="(option, optionIndex) in poll.options" :key="optionIndex">
              {{ option.option }}
            </li>
          </ul>
        </div>

        <div class="poll-card-footer">
          <router-link :to="'/poll/' + poll._id">Vote Now</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../compos/navbar.vue";

export default {
  name: 'MyPolls',

  components: {
    Navbar
  },

  data() {
    return {
      polls: []
    }
  },

  mounted() {
    // Fetch the user's polls from the API
  },

  methods: {
    // Handle voting on a poll
  }
}
</script>