<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-container">
        <h2>Gérer les avis reçus</h2>
  
        <div v-if="isLoading" class="loader-container">
          <div class="loader"></div>
        </div>
  
        <div v-else-if="avisList.length">
          <div class="avis-card" v-for="avis in avisList" :key="avis.id">
            <div class="avis-details">
              <p><strong>Auteur :</strong> {{ avis.auteur }}</p>
              <p><strong>Note :</strong> {{ avis.note }}/5 ⭐</p>
              <p><strong>Commentaire :</strong> {{ avis.commentaire }}</p>
            </div>
            <div class="btn-group">
              <button @click="validerAvis(avis.id)" class="btn-vert">Valider</button>
              <button @click="refuserAvis(avis.id)" class="btn-rouge">Refuser</button>
            </div>
          </div>
        </div>
        <p v-else>Aucun avis à gérer.</p>
  
        <button @click="$emit('close')" class="btn-fermer">Fermer</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, inject } from "vue";
  import { ecorideService } from "@/services/backend-api.js";
  
  export default {
    props: {
      showModal: Boolean,
    },
    setup() {
      const avisList = ref([]);
      const isLoading = ref(false);
      const authStore = inject("authStore");
      const token = authStore?.token;
  
      const rechercherAvis = async () => {
        isLoading.value = true;
        try {
          const data = await ecorideService("", "/avis/getAvisATraiter", "GET", token);
          avisList.value = data;
        } catch (error) {
          console.error("Erreur lors de la récupération des avis :", error);
        } finally {
          isLoading.value = false;
        }
      };
  
      const validerAvis = async (avisId) => {
        try {
          await ecorideService({ avisId }, "/avis/validerAvis", "PUT", token);
          avisList.value = avisList.value.filter((avis) => avis.id !== avisId);
        } catch (error) {
          console.error("Erreur lors de la validation de l'avis :", error);
        }
      };
  
      const refuserAvis = async (avisId) => {
        try {
          await ecorideService({ avisId }, "/avis/refuserAvis", "DELETE", token);
          avisList.value = avisList.value.filter((avis) => avis.id !== avisId);
        } catch (error) {
          console.error("Erreur lors du refus de l'avis :", error);
        }
      };
  
      onMounted(() => {
        rechercherAvis();
      });
  
      return { avisList, isLoading, validerAvis, refuserAvis };
    },
  };
  </script>
  
  <style scoped>
  /* Overlay de la modale */
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
  
  /* Conteneur principal */
  .modal-container {
    background: white;
    width: 500px;
    max-width: 90%;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  
  /* Liste des avis */
  .avis-card {
    background: #f9f9f9;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: left;
  }
  
  /* Détails de l'avis */
  .avis-details p {
    margin: 5px 0;
  }
  
  /* Boutons */
  .btn-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
  }
  
  .btn-vert {
    background-color: green;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-rouge {
    background-color: red;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-fermer {
    margin-top: 15px;
    background-color: gray;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  /* Loader */
  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }
  
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #385C05;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  