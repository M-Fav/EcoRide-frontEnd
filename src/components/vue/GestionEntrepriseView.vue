<template>
    <div class="gestion-entreprise-container">
      <!-- Bloc gauche : Gestion des utilisateurs -->
      <div class="users-section">
        <h2>Utilisateurs</h2>
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="searchUsers" 
          placeholder="Rechercher un utilisateur..."
        />
        <button @click="openCreateEmployeeModal">Créer un employé</button>
        <div class="user-cards">
          <div 
            v-for="employe in filteredUsers" 
            :key="employe?.utilisateurId" 
            class="user-card"
            :class="{ selected: selectedUtilisateurId === employe?.utilisateurId }"
                @click="selectedUtilisateurId =  employe.utilisateurId"
          >
            <span>{{ employe?.nom }} ({{ employe?.statut }})</span>
            <button v-if="employe?.statut === 'ACTIF'" @click="changerStatutUtilisateur('SUSPENDU', employe?.utilisateurId)" class="btn">Suspendre</button>
            <button v-if="employe?.statut === 'SUSPENDU'" @click="changerStatutUtilisateur('ACTIF', employe?.utilisateurId)" class="btn">Activer</button>
          </div>
        </div>
      </div>
  
      <!-- Bloc droit : Statistiques -->
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
  
    <!-- Modale de création d'employé -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Créer un employé</h3>
        <label>Nom : <input type="text" v-model="newEmployee.name" /></label>
        <button @click="createEmployee">Créer</button>
        <button @click="closeCreateEmployeeModal">Annuler</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { ecorideService } from "@/services/backend-api.js";
  import { useAuthStore } from "@/stores/authStore";
  
  export default {
    name: "UtilisateurView",
    setup() {
      // Références pour les utilisateurs et recherche
      const users = ref([]);
      const filteredUsers = ref(users.value);
      const searchQuery = ref('');
      const showModal = ref(false);
      const newEmployee = ref({ name: '' });
      const selectedDate = ref('');
      const authStore = useAuthStore();
      const token = authStore.token;
      const user = authStore.user;
      const selectedUtilisateurId = ref(null);
  
      // Fonction de recherche d'utilisateurs
      const rechercheEmployes = async () => {
        try {
          const data = await ecorideService(
            "", 
            "/utilisateur/findUtilisateurEmploye", 
            "GET", 
            token
          );
          filteredUsers.value = data;
          console.log(data)
        } catch (error) {
          console.error("Erreur lors de la récupération des employés", error);
        }
      };

      const changerStatutUtilisateur = async (statut, utilisateurId) => {
        try {
          const data = await ecorideService(
            { utilisateurId: utilisateurId, statut: statut }, 
            "/utilisateur/gererStatutUtilisateur", 
            "PUT", 
            token
          );
          console.log(data)
          rechercheEmployes();
        } catch (error) {
          console.error("Erreur lors du changement de statut utilisateur", error);
        }
      };
  
      // Fonction pour ouvrir la modal de création d'un employé
      const openCreateEmployeeModal = () => {
        showModal.value = true;
      };
  
      // Fonction pour fermer la modal de création d'un employé
      const closeCreateEmployeeModal = () => {
        showModal.value = false;
      };
  
      // Fonction pour créer un nouvel employé
      const createEmployee = () => {
        if (newEmployee.value.name) {
          const newUser = {
            id: users.value.length + 1,
            name: newEmployee.value.name,
            status: 'Actif',
          };
          users.value.push(newUser);
          filteredUsers.value.push(newUser); // Ajouter également à la liste filtrée
          newEmployee.value.name = '';
          showModal.value = false;
        }
      };
  
      // Initialiser la liste filtrée lors du montage du composant
      onMounted(() => {
        rechercheEmployes();
      });
  
      return {
        users,
        filteredUsers,
        searchQuery,
        showModal,
        newEmployee,
        selectedDate,
        openCreateEmployeeModal,
        closeCreateEmployeeModal,
        createEmployee,
        searchUsers: rechercheEmployes,
        user,
        selectedUtilisateurId,
        changerStatutUtilisateur,
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
  
  .users-section,
  .stats-section {
    width: 50%;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .user-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Deux colonnes égales */
}
  
  .user-card {
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 10px;
    margin: 5px;
    border-radius: 8px;
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
  
  .charts {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .chart {
    flex: 1;
    height: 200px;
    background: #eaeaea;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    padding: 20px;
    border-radius: 8px;
  }
 
  </style>
  