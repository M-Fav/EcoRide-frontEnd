<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Donner un avis</h3>
        <hr class="modal-divider">
  
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
          <button @click="submitReview" class="btn-vert">Valider</button>
          <button @click="closeModal" class="btn-rouge btn-close-position">Fermer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  import { ecorideService } from "@/services/backend-api.js";
  import { useAuthStore } from "@/stores/authStore";
  
  export default {
    name: "AvisModal",
    props: {
      showModal: {
        type: Boolean,
        required: true,
      },
      covoitureurId: {
        type: Number, // Utilise Number au lieu de int
        required: true,
        validator: (value) => Number.isInteger(value) && value >= 0,
      },
    },
    setup(props, { emit }) {
      const rating = ref(0);
      const comment = ref("");
      const authStore = useAuthStore();
      const token = computed(() => authStore.token);
  
      const setRating = (star) => {
        rating.value = star;
      };
  
      const createAvis = async () => {
        try {
          const credentialsVoitures = { 
            commentaire: comment.value,
            note: rating.value,
            covoitureurId: props.covoitureurId
          };
          const data = await ecorideService(credentialsVoitures, "/avis/createAvis", "POST", token.value);
          console.log(data)
        } catch (error) {
          console.error("Erreur lors de la récupération des voitures :", error);
        } 
        closeModal();
      };
  
      const closeModal = () => {
        emit("close");
      };
  
      return {
        rating,
        comment,
        setRating,
        submitReview: createAvis,
        closeModal,
      };
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

  .stars-rating {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.star {
  font-size: 30px;
  color: lightgray;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
}

.star.filled {
  color: gold;
}

.star:hover {
  transform: scale(1.2);
}

textarea {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  transition: border 0.3s ease;
}

textarea:focus {
  border-color: #007bff;
  outline: none;
}
</style>

  