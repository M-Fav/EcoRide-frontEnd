<template>
  <div class="gestion-entreprise-container">
    <div class="users-section">
      <h2>Utilisateurs</h2>
      <input 
        type="text" 
        v-model="searchQuery" 
        @input="searchUsers" 
        placeholder="Rechercher un utilisateur..."
      />
      <button @click="openSignUpModal" class="btn-vert">Créer un employé</button>
      <div v-if="isEmployesLoading" class="loader-container">
        <div class="loader"></div>
      </div>
      <div v-else>
        <div class="user-cards">
          <div 
            v-for="employe in filteredUsers" 
            :key="employe?.utilisateurId" 
            class="user-card"
            :class="{ selected: selectedUtilisateurId === employe?.utilisateurId }"
            @click="selectedUtilisateurId = employe.utilisateurId"
          >
            <span>{{ employe?.nom }} ({{ employe?.statut }})</span>
            <button v-if="employe?.statut === 'ACTIF'" @click="changerStatutUtilisateur('SUSPENDU', employe?.utilisateurId)" class="btn-rouge">Suspendre</button>
            <button v-if="employe?.statut === 'SUSPENDU'" @click="changerStatutUtilisateur('ACTIF', employe?.utilisateurId)" class="btn-vert">Activer</button>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h2>Statistiques</h2>
      <label for="date-range">Période : </label>
      <input type="date" id="date-range" v-model="selectedDate" />
      <div class="charts">
        <div class="chart" id="chart1"></div>
        <div class="chart" id="chart2"></div>
      </div>
    </div>
  </div>

  <SignUpModal v-if="isModalSignUpVisible" :title="'Créer un employé'" :role="'EMPLOYE'" @close="closeSignUpModal" @submit="creerEmploye" />
</template>

<script>
import { ref, onMounted } from 'vue';
import { ecorideService } from "@/services/backend-api.js";
import { useAuthStore } from "@/stores/authStore";
import SignUpModal from "@/components/modal/SignUpModal.vue"; 

export default {
  name: "GestionEntrepriseView",
  components: { SignUpModal },

  setup(props) {
    const users = ref([]);
    const filteredUsers = ref(users.value);
    const searchQuery = ref('');
    const isModalSignUpVisible = ref(false);
    const selectedDate = ref('');
    const authStore = useAuthStore();
    const token = authStore.token;
    const selectedUtilisateurId = ref(null);
    const isEmployesLoading = ref(false);

    const openSignUpModal = () => {
      isModalSignUpVisible.value = true;
    };

    const closeSignUpModal = () => {
      isModalSignUpVisible.value = false;
    };

    const rechercheEmployes = async () => {
      isEmployesLoading.value = true;
      try {
        const data = await ecorideService(
          "", 
          "/utilisateur/findUtilisateurEmploye", 
          "GET", 
          token
        );
        filteredUsers.value = data;
      } catch (error) {
        console.error("Erreur lors de la récupération des employés", error);
      } finally {
        isEmployesLoading.value = false;
      }
    };

    const changerStatutUtilisateur = async (statut, utilisateurId) => {
      try {
        await ecorideService(
          { utilisateurId, statut }, 
          "/utilisateur/gererStatutUtilisateur", 
          "PUT", 
          token
        );
        rechercheEmployes();
      } catch (error) {
        console.error("Erreur lors du changement de statut utilisateur", error);
      }
    };

    const creerEmploye = async (formData) => {
      try {
        const credentials = {
          nom: formData.nom,
          email: formData.email,
          motDePasse: formData.motDePasse,
          role: props.userRole
        };

        await ecorideService(credentials, "/utilisateur/creerEmploye", "POST", token);
        rechercheEmployes();
        closeSignUpModal();
      } catch (error) {
        console.error("Erreur lors de la création de l'employé", error);
      }
      rechercheEmployes();
    };

    onMounted(() => {
      rechercheEmployes();
    });

    return {
      users,
      filteredUsers,
      searchQuery,
      selectedDate,
      rechercheEmployes,
      isEmployesLoading,
      selectedUtilisateurId,
      changerStatutUtilisateur,
      openSignUpModal,
      closeSignUpModal,
      isModalSignUpVisible,
      creerEmploye,
    };
  },
};
</script>

<style scoped>
.gestion-entreprise-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}
.users-section, .stats-section {
  width: 50%;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.user-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.user-card {
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 10px;
  margin: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}
.user-card:hover {
  background: #f4f4f4;
}
.user-card.selected {
  border-color: #385c05;
  background-color: #eaf5d3;
}

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
