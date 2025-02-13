<template>
  <div class="sign-in-modal">
    <div class="modal-content">
      <h2>Inscription</h2>
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
            <input id="dateNaissance" type="date" v-model="dob" required />
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
export default {
  data() {
    return {
      pseudo: "",
      password: "",
      email: "",
      role: "UTILISATEUR",
      nom: "",
      prenom: "",
      dateNaissance: "",
      adresse: "",
      telephone: "",
      photo: null,
    };
  },
  methods: {
    signUp() {
      console.log("Inscription:", {
        pseudo: this.pseudo,
        password: this.password,
        email: this.email,
        role: this.role,
        nom: this.nom,
        prenom: this.prenom,
        dob: this.dob,
        adresse: this.adresse,
        telephone: this.telephone,
        photo: this.photo,
      });
      this.closeModal();
    },
    handleFileUpload(event) {
      this.photo = event.target.files[0];
    },
    closeModal() {
      this.$emit("close");
    },
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
  z-index: 1000; /* S'assurer que la modale est toujours au-dessus des autres éléments */
}

.modal-content {
  background-color: #EDEFE4;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 500px;
  position: relative;
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
