<template>
  <div class="login-modal">
    <div class="modal-content">
      <h2>{{ title || "Connexion" }}</h2>
      <hr class="modal-divider">
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="pseudo">Pseudo</label>
          <input id="pseudo" type="text" v-model="pseudo" required />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input id="password" type="password" v-model="password" required />
        </div>
        <button type="submit" class="btn-vert">Se connecter</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn-rouge btn-close-position" @click="closeModal">Fermer</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { ecorideService } from "@/services/backend-api.js";

export default {
  props: {
    title: {
      type: String,
    },
  },
  setup(_, { emit }) {
    const pseudo = ref("");
    const password = ref("");
    const error = ref(null);
    const authStore = useAuthStore();

    const login = async () => {
      try {
        error.value = null;
        const credentials = {
          pseudo: pseudo.value,
          password: password.value,
        };
        const data = await ecorideService(credentials, '/login', 'POST');

        console.log("Utilisateur connecté :", data.utilisateur);

        authStore.login(data.utilisateur, data.access_token);
        closeModal();
      } catch (errorMessage) {
        console.error("Erreur lors de la connexion :", errorMessage);
        error.value = errorMessage;
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
  width: 400px;
  text-align: center;
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

.btn-close-position {
  position: absolute;
  top: 10px;
  right: 10px;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>