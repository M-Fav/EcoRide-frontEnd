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

    <!-- Affichage du token ou des erreurs -->
    <!--<div v-if="token">
      <h2>Token d'accès :</h2>
      <p>{{ token }}</p>
    </div>-->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Bouton S'inscrire pour ouvrir la modale -->
    <button @click="openSignUpModal">S'inscrire</button>

    <!-- Affichage de la modale si isModalVisible est true -->
    <SignInView v-if="isModalVisible" @close="closeSignUpModal" />
  </div>
</template>

<script>
import { loginUser } from "../services/backend-api.js";
import SignInView from "@/components/SignInView.vue"; 

export default {
  data() {
    return {
      username: "",
      password: "",
      token: null,
      error: null,
      isModalVisible: false, 
    };
  },
  components: {
    SignInView,
  },
  methods: {
    async login() {
      try {
        this.error = null;
        const credentials = { pseudo: this.username, password: this.password };
        const data = await loginUser(credentials);
        console.log("Token récupéré :", data.access_token);
        // Redirection avec le token
        this.$router.push({ name: "token-display", query: { token: data.access_token } });
      } catch (errorMessage) {
        console.error("Erreur lors de la connexion :", errorMessage);
        this.error = errorMessage;
      }
    },
    openSignUpModal() {
      this.isModalVisible = true;  // Afficher la modale
    },
    closeSignUpModal() {
      this.isModalVisible = false;  // Fermer la modale
    }
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
