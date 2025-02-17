import { createRouter, createWebHistory } from 'vue-router'
import LoginModal from '@/components/modal/LoginModal.vue'
import CovoituragesView from '@/components/vue/CovoituragesView.vue' 
import AccueilView from '@/components/vue/AccueilView.vue';
import UtilisateurView from '@/components/vue/UtilisateurView.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginModal
  },
  {
    path: '/covoiturages',
    name: 'covoiturages', 
    component: CovoituragesView,
    //props: route => ({ token: route.state?.token }) // récupératuon du token
  },
  {
    path: '/accueil',
    name: 'accueil',
    component: AccueilView
  },
  {
    path: '/utilisateur',
    name: 'utilisateur',
    component: UtilisateurView
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
