<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Donner un avis</h3>
  
        <!-- Section pour les étoiles -->
        <div class="stars-rating">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{'filled': rating >= star}"
            @click="setRating(star)"
          >&#9733;</span>
        </div>
  
        <!-- Zone de commentaire -->
        <textarea v-model="comment" placeholder="Écrivez votre commentaire ici..." rows="4"></textarea>
  
        <div class="modal-buttons">
          <button @click="submitReview">Valider</button>
          <button @click="closeModal">Fermer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AvisModal",
    data() {
      return {
        rating: 0, // Note de l'utilisateur (de 1 à 5 étoiles)
        comment: "", // Commentaire de l'utilisateur
      };
    },
    props: {
      showModal: {
        type: Boolean,
        required: true,
      },
    },
    methods: {
      setRating(star) {
        this.rating = star;
      },
      submitReview() {
        if (this.rating === 0) {
          alert("Veuillez attribuer une note avant de valider !");
          return;
        }
        // Logique d'envoi de l'avis
        console.log("Avis soumis:", {
          rating: this.rating,
          comment: this.comment,
        });
        this.closeModal(); // Ferme la modal après soumission
      },
      closeModal() {
        this.$emit('close'); // Émet un événement pour signaler que la modal doit être fermée
      },
    },
  };
  </script>

  <style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    width: 500px;
  }
</style>

  