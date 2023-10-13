import { createStore } from 'vuex';
import axios from 'axios'; // Import axios to make API requests
import { useToast } from 'vue-toastification'; // Import useToast for displaying notifications

const loadUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user);
  }
  return null;
};

const store = createStore({
  state: {
    user: loadUserFromLocalStorage(),
    allUsers: [],
    polls: [],
    myPolls: [],
  },

  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    clearUser(state) {
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    setAllUsers(state, users) {
      state.allUsers = users;
    },

    SET_POLLS(state, poll) {
      state.polls.push(poll);
    },

    REMOVE_POLL(state, pollId) {
      state.polls = state.polls.filter((poll) => poll.id !== pollId);
    },

    SET_MY_POLLS(state, myPolls) {
      state.myPolls = myPolls;
    },
  },

  actions: {
    async login({ commit }, userData) {
     // Create a Toast instance here

      try {
        const response = await axios.post("http://localhost:3000/login", userData);

        if (response.status === 200) {
          const { data } = response;

          const user = data.user;
          const token = data.token;

          commit('setUser', user);

      //  commit('setUser', userData); // Use 'setUser' mutation instead of 'SET_USER'
        //   commit('SET_TOKEN', data.token);

          localStorage.setItem('token', token);
        return response.data;
        } else {
          Toast.error("Login Failed: Unexpected response from server");
        }
      } catch (error) {
        Toast.error("Invalid Credentials");
      }
    },
   async logout({ commit }) {
    localStorage.removeItem('token');
        localStorage.removeItem('user');
      commit('clearUser');

    },
  },

  getters: {
    isLoggedIn: (state) => {
      return !!state.user;
    },

    userId: (state) => {
      return state.user ? state.user._id : null;
    },
  },
});

export default store;
