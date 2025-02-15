import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/components/LoginView.vue'
import TokenView from '@/components/TokenView.vue' 
import AccueilView from '@/components/AccueilView.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/token',
    name: 'token-display', 
    component: TokenView,
    props: route => ({ token: route.state?.token }) // récupératuon du token
  },
  {
    path: '/accueil',
    name: 'accueil',
    component: AccueilView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
