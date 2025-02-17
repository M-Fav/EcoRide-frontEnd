<template>
    <div class="user-space">
      <!-- Bloc Gauche : Historique Covoiturage -->
      <div class="history-section">
        <div class="history-cards">
          <!-- Covoiturages passés -->
          <div class="history-column">
            <h3>Covoiturages passés</h3>
            <div v-if="historiquePasses.length">
              <div v-for="trip in historiquePasses" :key="trip.id" class="history-card">
                <p><strong>Départ :</strong> {{ trip.depart }}</p>
                <p><strong>Arrivée :</strong> {{ trip.arrivee }}</p>
                <p><strong>Date :</strong> {{ trip.date }}</p>
              </div>
            </div>
            <p v-else>Aucun covoiturage passé.</p>
          </div>
  
          <!-- Covoiturages en cours -->
          <div class="history-column">
            <h3>Covoiturages en cours</h3>
            <div v-if="historiqueEnCours.length">
              <div v-for="trip in historiqueEnCours" :key="trip.id" class="history-card">
                <div class="trip-info">
                  <p><strong>Départ :</strong> {{ trip.depart }}</p>
                  <p><strong>Arrivée :</strong> {{ trip.arrivee }}</p>
                  <p><strong>Date :</strong> {{ trip.date }}</p>
                  <p><strong>Statut :</strong> {{ trip.statut }}</p>
                </div>
                <!-- Bouton Supprimer visible si statut ACTIF -->
                <div class="btn-group">
                <button v-if="trip.statut === 'ACTIF' && trip.conducteurId === user.utilisateurId" @click="supprimerCovoiturage(trip.id)" class="btn delete-btn">Supprimer</button>
                <button v-if="trip.statut === 'ACTIF' && trip.conducteurId === user.utilisateurId" @click="demarrerCovoiturage(trip.id)" class="btn start-btn">Démarrer</button>
                <button v-if="trip.statut === 'TERMINE' && trip.conducteurId !== user.utilisateurId" @click="validerCovoiturage(trip.id)" class="btn valid-btn">Valider</button>
                <button v-if="trip.statut === 'EN_COURS' && trip.conducteurId === user.utilisateurId" @click="terminerCovoiturage(trip.id)" class="btn finish-btn">Terminer</button>
              </div>

              </div>
            </div>
            <p v-else>Aucun covoiturage en cours.</p>
          </div>
        </div>
      </div>
  
      <!-- Bloc Droite : Utilisateur & Voitures -->
      <div class="right-section">
        <!-- Bloc Utilisateur -->
        <div class="user-info">
          <img :src="userPhoto" alt="Photo de profil" class="user-photo" />
          <div class="user-details">
            <h2>{{ user?.name }}</h2>
            <p>Email : {{ user?.email }}</p>
            <p>Crédits : <strong>{{ user?.credits }} €</strong></p>
            <button @click="ajouterCredits" class="btn">Alimenter crédits</button>
          </div>
        </div>
  
        <!-- Bloc Voitures -->
        <div class="vehicles-section">
          <h3>Vos voitures enregistrées</h3>
          <div v-if="isLoading" class="loader-container">
            <div class="loader"></div>
          </div>
          
          <div v-else-if="voitures.length" class="car-list">
            <div v-for="voiture in voitures" :key="voiture.id" class="car-card">
              <div class="car-icon">🚗</div>
              <div class="car-details">
                <h4>{{ voiture.marque }} - {{ voiture.modele }}</h4>
                <p>Année : {{ new Date(voiture.datePremiereImmatriculation).getFullYear() }}</p>
                <p>Couleur : {{ voiture.couleur }}</p>
              </div>
            </div>
          </div>
  
          <p v-else>Aucune voiture enregistrée.</p>
          <button @click="openCreateCarModal" class="btn-voiture">Créer une voiture</button>
        </div>
      </div>
    </div>
  
    <!-- Modale pour créer une voiture -->
    <CreerVoitureModal 
      :showModal="showCreerVoitureModal" 
      @close="closeCreateCarModal"
      @carCreated="fetchVoitures" 
    />
  </template>
  
  <script>
  import { ref, inject, onMounted } from "vue";
  import { ecorideService } from "@/services/backend-api.js";
  import { useAuthStore } from "@/stores/authStore";
  import CreerVoitureModal from "../modal/CreerVoitureModal.vue";
  
  export default {
    name: "UtilisateurView",
    components: {
      CreerVoitureModal,
    },
    setup() {
      const user = inject("user");
      const userPhoto = inject("userPhoto");
      const authStore = useAuthStore();
      const token = authStore.token;
      const utilisateurId = authStore.user.utilisateurId;
  
      const voitures = ref([]);
      const isLoading = ref(false);
      const showCreerVoitureModal = ref(false);
      const historiquePasses = ref([]);
      const historiqueEnCours = ref([]);
      
      // Déclaration de la constante covoiturageId
      const covoiturageId = ref(null);  // Initialisation à null, peut être modifié plus tard
  
      // Récupération des voitures
      const fetchVoitures = async () => {
        isLoading.value = true;
        try {
          const data = await ecorideService(
            { utilisateurId },
            "/voitures/recupererVoituresUtilisateur",
            "GET",
            token
          );
          voitures.value = data;
        } catch (error) {
          console.error("Erreur lors de la récupération des voitures :", error);
        } finally {
          isLoading.value = false;
        }
      };
  
      const fetchCovoiturages = async () => {
        try {
          const data = await ecorideService(
            { utilisateurId },
            "/covoiturage/getCovoituragesUtilisateur",
            "GET",
            token
          );
  
          historiquePasses.value = data.listeCovoituragesPasses.map(covoiturage => ({
            id: covoiturage.covoiturageId,
            depart: covoiturage.lieuDepart,
            arrivee: covoiturage.lieuArrivee,
            date: covoiturage.date,
            statut: covoiturage.statut,
            conducteurId: covoiturage.conducteurId,
          }));
  
          historiqueEnCours.value = data.listeCovoituragesEnCours.map(covoiturage => ({
            id: covoiturage.covoiturageId,
            depart: covoiturage.lieuDepart,
            arrivee: covoiturage.lieuArrivee,
            date: covoiturage.date,
            statut: covoiturage.statut,
            conducteurId: covoiturage.conducteurId,
          }));
  
        } catch (error) {
          console.error("Erreur lors de la récupération des covoiturages :", error);
        }
      };
  
      onMounted(() => {
        fetchVoitures();
        fetchCovoiturages();
      });
  
      const ajouterCredits = () => alert("Ajout de crédits en cours...");
  
      const openCreateCarModal = () => {
        showCreerVoitureModal.value = true;
      };
  
      const closeCreateCarModal = () => {
        showCreerVoitureModal.value = false;
      };

       // Fonction pour démarrer un covoiturage
    const demarrerCovoiturage = async (id) => {
      try {
        const response = await ecorideService(
          { covoiturageId: id },
          "/covoiturage/startCovoiturage",
          "PUT",
          token
        );
        console.log('Covoiturage démarré:', response);
        fetchCovoiturages(); // Met à jour l'historique
      } catch (error) {
        console.error("Erreur lors du démarrage du covoiturage:", error);
      }
    };

    // Fonction pour terminer un covoiturage
    const terminerCovoiturage = async (id) => {
      try {
        const response = await ecorideService(
          { covoiturageId: id },
          "/covoiturage/terminateCovoiturage",
          "PUT",
          token
        );
        console.log('Covoiturage terminé:', response);
        fetchCovoiturages(); // Met à jour l'historique
      } catch (error) {
        console.error("Erreur lors de la fin du covoiturage:", error);
      }
    };

    const validerCovoiturage = async (id) => {
      try {
        const response = await ecorideService(
          { covoiturageId: id, utilisateurId },
          "/covoitureur/validateCovoiturage",
          "PUT",
          token
        );
        console.log('Covoiturage terminé:', response);
        fetchCovoiturages(); // Met à jour l'historique
      } catch (error) {
        console.error("Erreur lors de la fin du covoiturage:", error);
      }
    };
  
      // Fonction pour supprimer un covoiturage
      const supprimerCovoiturage = async (id) => {
        try {
          // Requête API pour supprimer le covoiturage
          const response = await ecorideService(
            { covoiturageId: id }, 
            "/covoiturage/deleteCovoiturage", 
            "POST", 
            token
          );
  
          console.log(response)
        } catch (error) {
          console.error("Erreur lors de la suppression du covoiturage:", error);
        }

        fetchCovoiturages();
      };
  
      return {
        user,
        userPhoto,
        voitures,
        isLoading,
        showCreerVoitureModal,
        openCreateCarModal,
        closeCreateCarModal,
        fetchVoitures,
        ajouterCredits,
        historiquePasses,
        historiqueEnCours,
        demarrerCovoiturage,
        validerCovoiturage,
        terminerCovoiturage,
        supprimerCovoiturage,
        covoiturageId
      };
    },
  };
  </script>
  
  <style scoped>
  /* Conteneur principal */
  .user-space {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding: 20px;
    box-sizing: border-box;
  }
  
  /* Bloc Gauche : Historique Covoiturage */
  .history-section {
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }
  
  .history-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    height: 100%;
  }
  
  .history-column {
    display: flex;
    flex-direction: column;
  }
  
  .history-column:first-child {
    position: relative;
  }
  
  .history-column:first-child::after {
    content: "";
    position: absolute;
    top: 0;
    right: -10px; 
    width: 2px;
    height: 100%;
    background-color: #385C05;
  }

  .history-card {
    background: white;
    padding: 15px;
    margin: 5px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
  }
  
  .trip-info {
    flex-grow: 1;
  }
  
  /* Bouton Supprimer - petit, rouge, et collé à droite */
  .delete-btn {
    background: red;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .delete-btn:hover {
    opacity: 0.8;
  }
  
  /* Bloc Droite : Utilisateur & Voitures */
  .right-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  /* Bloc Utilisateur */
  .user-info {
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .user-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
  }
  
  /* Bloc Voitures */
  .vehicles-section {
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* Liste des voitures en grid */
  .car-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
  
  .car-card {
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .car-icon {
    font-size: 30px;
  }
  
  .car-details h4 {
    margin: 0;
    font-size: 16px;
  }
  
  .car-details p {
    margin: 5px 0;
    font-size: 14px;
    color: #555;
  }
  
  /* Boutons */
  .btn-voiture {
    background: #27ae60;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .btn:hover {
    opacity: 0.8;
  }

  .start-btn {
  background: #27ae60;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.start-btn:hover {
  opacity: 0.8;
}

/* Nouveau bouton Terminer */
.finish-btn {
  background: #f39c12;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.finish-btn:hover {
  opacity: 0.8;
}

.valid-btn {
  background: #27ae60;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.valid-btn:hover {
  opacity: 0.8;
}



/* Conteneur des boutons */
.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
  </style>
  