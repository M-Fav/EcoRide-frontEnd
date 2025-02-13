<template>
    <div class="token-display">
      <h1>Token d'accès</h1>
      <p v-if="token">Voici votre token : {{ token }}</p>
      <p v-else>Le token n'est pas disponible.</p>
  
      <!-- Bouton de retour vers la page de login -->
      <button @click="goBack">Retour à la page de connexion</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        token: null, // Initialise le token
      };
    },
    created() {
      // Récupérer le token passé via les query params
      this.token = this.$route.query.token;
      console.log("Token reçu via query params :", this.token);
    },
    methods: {
      // Méthode pour revenir à la page de login
      goBack() {
        this.$router.push({ name: "login" }); // Navigue vers la page de login
      }
    }
  };
  </script>
  
  <style scoped>
  .token-display {
    text-align: center;
    margin-top: 50px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  