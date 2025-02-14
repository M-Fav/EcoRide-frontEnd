<template>
  <div class="login">
    <h1>Connexion</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Identifiant</label>
        <input
          id="username"
          type="text"
          v-model="username"
          placeholder="Entrez votre identifiant"
          required
        />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="Entrez votre mot de passe"
          required
        />
      </div>
      <button type="submit">Se connecter</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <!-- Bouton S'inscrire pour ouvrir la modale -->
    <button @click="openSignUpModal">S'inscrire</button>

    <!-- Affichage de la modale si isModalVisible est true -->
    <SignInView v-if="isModalVisible" @close="closeSignUpModal" />
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore"; // Import du store Pinia
import { loginUser } from "../services/backend-api.js";
import SignInView from "@/components/SignInView.vue"; 

export default {
  components: { SignInView },
  setup() {
    const username = ref("");
    const password = ref("");
    const error = ref(null);
    const isModalVisible = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const login = async () => {
      try {
        error.value = null;
        const credentials = { pseudo: username.value, password: password.value };
        const data = await loginUser(credentials);

        console.log("Utilisateur connecté :", data.utilisateur);

        // Stocker les données utilisateur et le token dans Pinia
        authStore.login(data.utilisateur, data.access_token);

        // Redirection vers une page après connexion
        router.push({ name: "token-display", query: { token: data.access_token } });
      } catch (errorMessage) {
        console.error("Erreur lors de la connexion :", errorMessage);
        error.value = "Échec de la connexion. Vérifiez vos identifiants.";
      }
    };

    const openSignUpModal = () => {
      isModalVisible.value = true;
    };

    const closeSignUpModal = () => {
      isModalVisible.value = false;
    };

    return { username, password, error, isModalVisible, login, openSignUpModal, closeSignUpModal };
  },
};
</script>

<style scoped>
/* Container du formulaire */
.login {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: white;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  div {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  error {
    color: red;
    font-weight: bold;
    text-align: center;
  }
  
  /* Media Queries pour rendre le design responsive */
  
  /* Écrans de plus de 600px (tablettes et plus) */
  @media (min-width: 600px) {
    .login {
      width: 80%;
      max-width: 500px; /* Limite la largeur sur les grands écrans */
    }
  }
  
  /* Écrans de plus de 768px (ordinateurs de bureau) */
  @media (min-width: 768px) {
    .login {
      width: 60%;
      max-width: 600px;
    }
  }
  
  /* Mobile (moins de 600px) */
  @media (max-width: 600px) {
    .login {
      padding: 15px;
      width: 100%;
      max-width: none;
    }
  
    input, button {
      font-size: 14px;
    }
  }
</style>
