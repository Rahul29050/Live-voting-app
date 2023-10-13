import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import Login from '../components/Login.vue';
import Signup from '../components/Signup.vue';
import Dashboard from '../components/Dashboard.vue';
import PollDetails from '../components/PollDetails.vue';
import mypolls from '../components/mypolls.vue'
import store from '../store/store'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/poll/:id',
    name: 'PollDetails',
    component: PollDetails,
  },
  {
    path: '/mypolls',
    name: 'mypolls',
    component : mypolls,
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isLoggedIn;
  console.log(isAuthenticated);

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } 
  else if (isAuthenticated && (to.name === 'login' || to.name === 'signup' || to.name === 'LandingPage')) {
    next('/dashboard');
  }
   else {
    next();
  }
});



// router.beforeEach((to, from, next) => {
//   const isAuthenticated = store.getters.isLoggedIn;
//   console.log(isAuthenticated)
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  
//   if (requiresAuth && !isAuthenticated) {
//     router.push('/');
//   } else {
//     next();
//   }
// });


export default router;
