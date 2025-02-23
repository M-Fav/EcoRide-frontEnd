<template>
  <div class="user-space">
    <!-- Bloc Gauche : Historique Covoiturage -->
    <div class="history-section">
      <div class="history-cards">
        <!-- Covoiturages passés -->
        <div class="history-column">
          <h3>Covoiturages passés</h3>
          <div v-if="isCovoituragesLoading" class="loader-container">
            <div class="loader"></div>
          </div>
          <div v-else>
            <div v-if="historiquePasses.length">
              <div v-for="trip in historiquePasses" :key="trip.id" class="history-card">
                <p><strong>Départ :</strong> {{ trip.depart }}</p>
                <p><strong>Arrivée :</strong> {{ trip.arrivee }}</p>
                <p><strong>Date :</strong> {{ trip.date }}</p>
              </div>
            </div>
            <p v-else>Aucun covoiturage passé.</p>
          </div>
        </div>

        <!-- Covoiturages en cours -->
        <div class="history-column">
          <h3>Covoiturages en cours</h3>
          <div v-if="isCovoituragesLoading" class="loader-container">
            <div class="loader"></div>
          </div>
          <div v-else>
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
                  <button v-if="trip.statut === 'ACTIF' && user && trip.conducteurId === user.utilisateurId"
                    @click="supprimerCovoiturage(trip.id)" class="btn-rouge">Supprimer</button>
                  <button v-if="trip.statut === 'ACTIF' && user && trip.conducteurId === user.utilisateurId"
                    @click="demarrerCovoiturage(trip.id)" class="btn-vert">Démarrer</button>
                  <button
                    v-if="trip.statut === 'TERMINE' && user && trip.conducteurId !== user.utilisateurId && trip.validationCovoiturage === false"
                    @click="validerCovoiturage(trip.id, trip.covoitureurId)" class="btn-vert valid-btn">Valider</button>
                  <button v-if="trip.statut === 'EN_COURS' && user && trip.conducteurId === user.utilisateurId"
                    @click="terminerCovoiturage(trip.id)" class="btn-orange">Terminer</button>
                </div>
              </div>
            </div>
            <p v-else>Aucun covoiturage en cours.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bloc Droite : Utilisateur & Voitures -->
    <div class="right-section">
      <!-- Bloc Utilisateur -->
      <div class="user-info">
        <img :src="userPhoto" alt="Photo de profil" class="user-photo" />
        <div class="user-details">
          <h2>{{ user?.nom }}</h2>
          <p class="user-email">Email : {{ user?.email }}</p>
          <div class="credit-section">
            <p>Crédits: </p>
            <span class="user-credit">{{ user?.credit }}</span>
            <img src="../../assets/images/leaf.png" class="credit-icon" />
          </div>
          <button @click="openAjouterCreditModal" class="btn-vert">Alimenter crédits</button>
          <button v-if="user?.role === 'EMPLOYE' || user?.role === 'ADMINISTRATEUR'" @click="openGererAvisModal" class="btn-vert">Gérer avis</button>
        </div>
      </div>

      <!-- Bloc Voitures -->
      <div class="vehicles-section">
        <h3>Vos voitures enregistrées</h3>
        <div v-if="isVoituresLoading" class="loader-container">
          <div class="loader"></div>
        </div>
        <div v-else>
          <div v-if="voitures.length" class="car-list">
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
        </div>
        <button @click="openCreateCarModal" class="btn-vert">Créer une voiture</button>
      </div>
    </div>
  </div>

  <CreerVoitureModal :showModal="showCreerVoitureModal" @close="closeCreateCarModal" @carCreated="fetchVoitures" />

  <CreerAvisModal :showModal="showCreerAvisModal" :covoitureurId="covoitureurId" @close="closeCreerAvisModal" />

  <GererAvisModal :showModal="showGererAvisModal" :covoitureurId="covoitureurId" @close="closeGererAvisModal" />

  <AjouterCreditModal :showModal="showAjouterCreditModal"  @close="closeAjouterCreditModal" />

</template>

<script>
import { ref, inject, onMounted, computed } from "vue";
import { ecorideService } from "@/services/backend-api.js";
import { useAuthStore } from "@/stores/authStore";
import CreerVoitureModal from "../modal/CreerVoitureModal.vue";
import CreerAvisModal from "../modal/CreerAvisModal.vue";
import GererAvisModal from "../modal/GererAvisModal.vue";
import AjouterCreditModal from "../modal/AjouterCreditModal.vue";

export default {
  name: "UtilisateurView",
  components: {
    CreerVoitureModal, CreerAvisModal, GererAvisModal, AjouterCreditModal,
  },
  setup() {
    const user = inject("user");
    const userPhoto = inject("userPhoto");
    const authStore = useAuthStore();
    const token = authStore.token;
    const utilisateurId = computed(() => authStore.user?.utilisateurId ?? '');
    const covoitureurId = ref(0);


    const voitures = ref([]);
    const isCovoituragesLoading = ref(false);
    const isVoituresLoading = ref(false);
    const showCreerVoitureModal = ref(false);
    const showCreerAvisModal = ref(false);
    const showGererAvisModal = ref(false);
    const showAjouterCreditModal = ref(false);
    const historiquePasses = ref([]);
    const historiqueEnCours = ref([]);

    // Déclaration de la constante covoiturageId
    const covoiturageId = ref(null);  // Initialisation à null, peut être modifié plus tard

    // Récupération des voitures
    const fetchVoitures = async () => {
      isVoituresLoading.value = true;
      try {
        const data = await ecorideService(
          { utilisateurId: utilisateurId.value },
          "/voitures/recupererVoituresUtilisateur",
          "GET",
          token
        );
        voitures.value = data;
      } catch (error) {
        console.error("Erreur lors de la récupération des voitures :", error);
      } finally {
        isVoituresLoading.value = false;
      }
    };

    const fetchCovoiturages = async () => {
      isCovoituragesLoading.value = true;
      try {
        const data = await ecorideService(
          { utilisateurId: utilisateurId.value },
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
          covoitureurId: covoiturage.covoitureurId,
        }));

        historiqueEnCours.value = data.listeCovoituragesEnCours.map(covoiturage => ({
          id: covoiturage.covoiturageId,
          depart: covoiturage.lieuDepart,
          arrivee: covoiturage.lieuArrivee,
          date: covoiturage.date,
          statut: covoiturage.statut,
          conducteurId: covoiturage.conducteurId,
          validationCovoiturage: covoiturage.validationCovoiturage,
          covoitureurId: covoiturage.covoitureurId,
        }));

      } catch (error) {
        console.error("Erreur lors de la récupération des covoiturages :", error);
      } finally {
        isCovoituragesLoading.value = false;
      }
    };

    onMounted(() => {
      fetchVoitures();
      fetchCovoiturages();
    });

    const openCreateCarModal = () => {
      showCreerVoitureModal.value = true;
    };

    const closeCreateCarModal = () => {
      showCreerVoitureModal.value = false;
    };

    const openCreerAvisModal = (id) => {
      covoitureurId.value = id;
      showCreerAvisModal.value = true;
    };

    const closeCreerAvisModal = () => {
      showCreerAvisModal.value = false;
    };

    const openGererAvisModal = () => {
      showGererAvisModal.value = true;
    };

    const closeGererAvisModal = () => {
      showGererAvisModal.value = false;
    };

    const openAjouterCreditModal = () => {
      showAjouterCreditModal.value = true;
    }

    const closeAjouterCreditModal = () => {
      showAjouterCreditModal.value = false;
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

    const validerCovoiturage = async (id, covoitureurId) => {
      try {
        const response = await ecorideService(
          { covoiturageId: id, utilisateurId: utilisateurId.value },
          "/covoitureur/validateCovoiturage",
          "PUT",
          token
        );
        console.log('Covoiturage validé:', response);
        openCreerAvisModal(covoitureurId);
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
      isCovoituragesLoading,
      isVoituresLoading,
      showCreerVoitureModal,
      showCreerAvisModal,
      showGererAvisModal,
      showAjouterCreditModal,
      openCreateCarModal,
      closeCreateCarModal,
      openCreerAvisModal,
      closeCreerAvisModal,
      openGererAvisModal,
      closeGererAvisModal,
      openAjouterCreditModal,
      closeAjouterCreditModal,
      fetchVoitures,
      historiquePasses,
      historiqueEnCours,
      demarrerCovoiturage,
      validerCovoiturage,
      terminerCovoiturage,
      supprimerCovoiturage,
      covoiturageId,
      covoitureurId,
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
  padding: 1em;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #385c05;
}

.credit-section {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
}

.user-credit {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1;
  vertical-align: middle;
}

.user-email {
  margin-block-end: 0;
}

.credit-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

/* Liste des voitures en grid */
.car-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.car-card {
  border: 2px solid #385c05;
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

/* Style du loader */
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>