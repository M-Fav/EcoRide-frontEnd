<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo à gauche et plus petit -->
      <img alt="Vue logo" src="../assets/logoEcoRide.png" class="headerLogo" />

      <!-- Navigation centrée en bas -->
      <nav>
        <ul>
          <li><router-link to="/accueil">Accueil</router-link></li>
          <li><router-link to="/covoiturages">Covoiturages</router-link></li>
          <!--<li><router-link to="/login">Connexion/Inscription</router-link></li>-->
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </nav>

      <!-- Affichage du profil utilisateur si connecté -->
      <div v-if="isAuthenticated" class="user-info">
        <img :src="userPhoto" alt="Profil" class="profile-pic" />
        <span class = "user-pseudo">{{ user.pseudo }}</span>
       <img  @click="logout" src="@/assets/iconeLogout.png"  alt="Déconnexion" class="logout-icon"/>
      </div>

      <!-- Si l'utilisateur n'est PAS connecté, afficher les boutons de connexion -->
      <div v-else class="auth-buttons">
        <button @click="openLoginModal" class="login-btn">Se connecter</button>
        <button @click="openSignUpModal" class="signup-btn">S'inscrire</button>

            <!-- Affichage de la modale si isModalVisible est true -->
        <SignUpView v-if="isModalSignUpVisible" @close="closeSignUpModal" />
        <LoginView v-if="isModalLoginVisible" @close="closeLoginModal" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const isModalLoginVisible = ref(false);
const isModalSignUpVisible = ref(false);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const userPhoto = computed(() => user.value?.photo || new URL("@/assets/iconeUser.png", import.meta.url).href);

const logout = () => {
  authStore.logout();
  router.push("/accueil"); // Redirige vers la page de connexion après déconnexion
};

const openSignUpModal = () => {
      isModalSignUpVisible.value = true;
    };

const closeSignUpModal = () => {
  isModalSignUpVisible.value = false;
    };

const openLoginModal = () => {
  isModalLoginVisible.value = true;
    };

    const closeLoginModal = () => {
      isModalLoginVisible.value = false;
    };

</script>

<script>
import SignUpView from "@/components/SignUpView.vue"; 
import LoginView from "@/components/LoginView.vue";

export default {
  components: { SignUpView, LoginView },
  
  name: "HeaderView",
};
</script>

<style scoped>
.header {
  background-color: #385C05;
  padding: 20px;
  height: 8em;
  position: relative;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  border-bottom: 6px solid #385C05;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.headerLogo {
  height: 150px; /* Réduit la taille du logo */
  width: auto;
  margin-left: 1em; /* Espace à gauche */
}

nav {
  width: 100%;
  display: flex;
  justify-content: center; /* Centre la barre de navigation */
  position: absolute;
  bottom: 10px; /* Place la barre de navigation en bas */
}

nav ul {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

a {
  color: #EDEFE4;
  text-decoration: none;
  padding: 0.5rem;
}

a {
  color: #EDEFE4;
  text-decoration: none;
  padding: 0.5rem;
  position: relative; /* Ajouté pour fixer le problème */
}

a::before {
  content: "";
  position: absolute;
  left: -5px; /* Positionne la ligne à gauche du lien */
  top: 0;
  bottom: 0;
  width: 5px;
  background-color: #EDEFE4;
  border-radius: 10px;
  transform: scaleY(0);
  transition: transform 0.3s ease-in-out;
}

a:hover::before {
  transform: scaleY(1);
}


/* Style du bloc utilisateur */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 20px;
}

.profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-pseudo {
  color: #EDEFE4;
}

.logout-btn {
  margin-top: 5px;
  background: #EDEFE4;
  color: #385C05;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.logout-btn:hover {
  background: #d4d6cb;
}

.logout-icon {
  width: 24px;
  height: 24px;
  padding-top: 0.5em;
}

</style>
