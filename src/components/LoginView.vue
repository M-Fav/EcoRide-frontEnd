<template>
  <div class="login-modal">
    <div class="modal-content">
      <h2>Connexion</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="pseudo">Pseudo</label>
          <input id="pseudo" type="text" v-model="pseudo" required />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input id="password" type="password" v-model="password" required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="close-button" @click="closeModal">Fermer</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { openBankingService } from "@/services/backend-api.js";

export default {
  setup(_, { emit }) {
    const pseudo = ref("");
    const password = ref("");
    const error = ref(null);
    const authStore = useAuthStore();
    const router = useRouter();

    const login = async () => {
      try {
        error.value = null;
        const credentials = { pseudo: pseudo.value, password: password.value };
        const data = await openBankingService(credentials, '/login');
        
        console.log("Utilisateur connecté :", data.utilisateur);
        
        authStore.login(data.utilisateur, data.access_token);
        router.push("/accueil");
        closeModal();
      } catch (errorMessage) {
        console.error("Erreur lors de la connexion :", errorMessage);
        error.value = "Échec de la connexion. Vérifiez vos identifiants.";
      }
    };

    const closeModal = () => {
      emit("close");
    };

    return { pseudo, password, error, login, closeModal };
  },
};
</script>

<style scoped>
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  text-align: center;
  position: relative;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
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

.close-button {
  background-color: #ff0000;
  width: auto;
  padding: 8px 16px;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.close-button:hover {
  background-color: #cc0000;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
