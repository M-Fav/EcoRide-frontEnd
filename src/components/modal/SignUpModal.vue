<template>
  <div class="sign-in-modal">
    <div class="modal-content">
      <h2>{{ title || 'Inscription' }}</h2>
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
        <p v-if="error" class="error">{{ error }}</p>
        <button class="btn-vert btn-signup" type="submit">S'inscrire</button>
      </form>
      <button class="btn-rouge btn-close-position" @click="closeModal">Fermer</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import dayjs from "dayjs";
import { useAuthStore } from "@/stores/authStore";
import { ecorideService } from "@/services/backend-api.js";

export default {
  props: {
    title: {
      type: String,
    },
    role: {
      type: String,
      default: "UTILISATEUR", // Valeur par défaut si aucun rôle n'est passé
    },
  },
  setup(props, { emit }) {
    const pseudo = ref("");
    const password = ref("");
    const email = ref("");
    const nom = ref("");
    const prenom = ref("");
    const photo = ref(null);
    const dateNaissance = ref("");
    const adresse = ref("");
    const telephone = ref("");
    const error = ref(null);
    const authStore = useAuthStore();

    // Regex et sanitize
    const pseudoRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const nameRegex = /^[a-zA-Zàâäéèêëïîôöùûüç' -]{2,50}$/i;
    const phoneRegex = /^[0-9+\-\s]{6,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitize = (str) => str.trim().replace(/[<>{}()$]/g, "");


    const signUp = async () => {
      error.value = null;

      //Variables sécurisées
      const cleanPseudo = sanitize(pseudo.value);
      const cleanPassword = password.value.trim();
      const cleanEmail = email.value.trim();
      const cleanNom = sanitize(nom.value);
      const cleanPrenom = sanitize(prenom.value);
      const cleanAdresse = sanitize(adresse.value);
      const cleanTelephone = telephone.value.trim();

      if (!pseudoRegex.test(cleanPseudo)) {
        error.value = "Le pseudo doit contenir 3 à 20 caractères alphanumériques.";
        return;
      }
      if (cleanPassword.length < 6) {
        error.value = "Le mot de passe doit contenir au moins 6 caractères.";
        return;
      }
      if (!emailRegex.test(cleanEmail)) {
        error.value = "L'adresse email n'est pas valide.";
        return;
      }
      if (!nameRegex.test(cleanNom)) {
        error.value = "Le nom doit contenir 2 à 50 caractères alphanumériques ou contient des caractères invalides.";
        return;
      }
      if (!nameRegex.test(cleanPrenom)) {
        error.value = "Le prénom doit contenir 2 à 50 caractères alphanumériques ou contient des caractères invalides.";
        return;
      }
      if (!dayjs(dateNaissance.value, "YYYY-MM-DD", true).isValid()) {
        error.value = "La date de naissance est invalide.";
        return;
      }
      if (cleanAdresse.length < 5) {
        error.value = "L'adresse est trop courte.";
        return;
      }
      if (!phoneRegex.test(cleanTelephone)) {
        error.value = "Le numéro de téléphone est invalide.";
        return;
      }

     
      try {
        const credentials = {
          pseudo: cleanPseudo,
          password: cleanPassword,
          email: cleanEmail,
          nom: cleanNom,
          prenom: cleanPrenom,
          photo: photo.value,
          dateNaissance: dayjs(dateNaissance.value).format("YYYY-MM-DD"),
          adresse: cleanAdresse,
          telephone: cleanTelephone,
          role: props.role,
          statut: 'ACTIF',
        };

        const data = await ecorideService(credentials, "/register", 'POST');

        console.log("Utilisateur créé :", data.utilisateur);

        if (props.role === 'UTILISATEUR') {
          authStore.login(data.utilisateur, data.access_token);
        }

        closeModal();
      } catch (errorMessage) {
        console.error("Erreur lors de l'inscription :", errorMessage);
        error.value = "Erreur lors de l'inscription. Veuillez réessayer.";
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

    return {
      pseudo,
      password,
      email,
      nom,
      prenom,
      adresse,
      telephone,
      photo,
      dateNaissance,
      error,
      signUp,
      handleFileUpload,
      closeModal,
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

.btn-signup {
  width: 100%;
}
</style>
