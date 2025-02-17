<template>
  <div class="sign-in-modal">
    <div class="modal-content">
      <h2>Inscription</h2>
      <hr class="modal-divider">
      <form @submit.prevent="signUp">
        <div class="form-grid">
          <div>
            <label for="pseudo">Pseudo</label>
            <input id="pseudo" type="text" v-model="pseudo" required />
          </div>
          <div>
            <label for="password">Mot de passe</label>
            <input id="password" type="password" v-model="password" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input id="email" type="email" v-model="email" required />
          </div>
          <div>
            <label for="nom">Nom</label>
            <input id="nom" type="text" v-model="nom" required />
          </div>
          <div>
            <label for="prenom">Prénom</label>
            <input id="prenom" type="text" v-model="prenom" required />
          </div>
          <div>
            <label for="dateNaissance">Date de naissance</label>
            <input id="dateNaissance" type="date" v-model="dateNaissance" required />
          </div>
          <div>
            <label for="adresse">Adresse</label>
            <input id="adresse" type="text" v-model="adresse" required />
          </div>
          <div>
            <label for="telephone">Téléphone</label>
            <input id="telephone" type="tel" v-model="telephone" required />
          </div>
        </div>
        <div class="photo-upload">
          <label for="photo">Photo</label>
          <input id="photo" type="file" @change="handleFileUpload" />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      <button class="close-button" @click="closeModal">Fermer</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import dayjs from "dayjs";
import { useAuthStore } from "@/stores/authStore";
import { ecorideService } from "@/services/backend-api.js";

export default {
  setup(_, { emit }) {
    // Déclarations des variables réactives
    const pseudo = ref("");
    const password = ref("");
    const email = ref("");
    const nom = ref("");
    const prenom = ref("");
    const photo = ref(null);
    const dateNaissance = ref("");
    const adresse = ref("");
    const telephone = ref("");
    const authStore = useAuthStore();


    // Fonction pour gérer l'inscription
    const signUp = async () => {
      try {
        const credentials = {
          pseudo: pseudo.value,
          password: password.value,
          email: email.value,
          nom: nom.value,
          prenom: prenom.value,
          photo: photo.value,
          dateNaissance: dayjs(dateNaissance.value, "YYYY-MM-DD").format("YYYY-MM-DD"),
          adresse: adresse.value,
          telephone: telephone.value,
          role: "UTILISATEUR",
        };

        const data = await ecorideService(credentials, "/register", 'POST');
        
        console.log("Utilisateur créé :", data.utilisateur);
        
        authStore.login(data.utilisateur, data.access_token);
        closeModal();
      } catch (errorMessage) {
        console.error("Erreur lors de la connexion :", errorMessage);
      }
    };


    // Fonction pour gérer le téléchargement de photo
    const handleFileUpload = (event) => {
      photo.value = event.target.files[0];
    };

    // Fonction pour fermer la modale
    const closeModal = () => {
      emit('close');
    };

    // Retourne les variables et fonctions pour les utiliser dans le template
    return {
      pseudo,
      password,
      email,
      nom,
      prenom,
      adresse,
      photo,
      signUp,
      handleFileUpload,
      closeModal,
      dateNaissance,
      telephone,
    };
  },
};
</script>

<style scoped>
.sign-in-modal {
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
  width: 500px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-grid div {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1rem;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.photo-upload {
  margin-top: 1rem;
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
  margin-top: 1rem;
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
</style>
