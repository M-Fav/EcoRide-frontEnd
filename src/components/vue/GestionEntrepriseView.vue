<template>
  <div class="gestion-entreprise-container">
    <div class="users-section">
      <!-- Section des utilisateurs -->
      <h2>Utilisateurs</h2>
      <input type="text" v-model="searchQuery" @input="searchUsers" placeholder="Rechercher un utilisateur..." />
      <button @click="openSignUpModal" class="btn-vert">Créer un employé</button>
      <div v-if="isEmployesLoading" class="loader-container">
        <div class="loader"></div>
      </div>
      <div v-else>
        <div class="user-cards">
          <div v-for="employe in filteredUsers" :key="employe?.utilisateurId" class="user-card"
            :class="{ selected: selectedUtilisateurId === employe?.utilisateurId }"
            @click="selectedUtilisateurId = employe.utilisateurId">
            <span>{{ employe?.nom }} ({{ employe?.statut }})</span>
            <button v-if="employe?.statut === 'ACTIF'"
              @click="changerStatutUtilisateur('SUSPENDU', employe?.utilisateurId)" class="btn-rouge">Suspendre</button>
            <button v-if="employe?.statut === 'SUSPENDU'"
              @click="changerStatutUtilisateur('ACTIF', employe?.utilisateurId)" class="btn-vert">Activer</button>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h2>Statistiques des Crédits</h2>

      <label class="month-select" for="month-select">Sélectionner le mois et l'année :</label>

      <select v-model="selectedMonth" id="month-select">
        <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
      </select>
      <select v-model="selectedYear" id="year-select">
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
      <button class="btn-vert" @click="afficherStatistiques()">Afficher</button>

      <!--Graphique-->
      <div v-if="creditStats.length > 0" class="charts">
        <canvas id="creditChart" width="400" height="200"></canvas>
      </div>
      <div v-else>
        <p>Aucune donnée à afficher pour cette période.</p>
      </div>
    </div>
  </div>

  <SignUpModal v-if="isModalSignUpVisible" :title="'Créer un employé'" :role="'EMPLOYE'" @close="closeSignUpModal"
    @submit="creerEmploye" />
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { ecorideService } from "@/services/backend-api.js";
import { useAuthStore } from "@/stores/authStore";
import SignUpModal from "@/components/modal/SignUpModal.vue";
import Chart from 'chart.js/auto';

export default {
  name: "GestionEntrepriseView",
  components: { SignUpModal },

  setup(props) {
    const users = ref([]);
    const filteredUsers = ref(users.value);
    const searchQuery = ref('');
    const isModalSignUpVisible = ref(false);
    const selectedMonth = ref(new Date().getMonth());
    const selectedYear = ref(new Date().getFullYear());
    const creditStats = ref([]);
    let currentChart = null;

    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const years = Array.from({ length: 11 }, (_, i) => selectedYear.value - 5 + i);

    const filteredStats = computed(() => {
      if (!selectedYear.value || selectedMonth.value === null) return [];
      return creditStats.value.filter(stat => {
        const statDate = new Date(stat.date);
        const statMonth = statDate.getMonth();
        const statYear = statDate.getFullYear();
        return statMonth === selectedMonth.value && statYear === selectedYear.value;
      });
    });

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
        const data = await ecorideService("", "/utilisateur/findUtilisateurEmploye", "GET", token);
        filteredUsers.value = data;
      } catch (error) {
        console.error("Erreur lors de la récupération des employés", error);
      } finally {
        isEmployesLoading.value = false;
      }
    };

    const changerStatutUtilisateur = async (statut, utilisateurId) => {
      try {
        await ecorideService({ utilisateurId, statut }, "/utilisateur/gererStatutUtilisateur", "PUT", token);
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

    const afficherStatistiques = async () => {
      try {
        const credentials = { mois: selectedMonth.value + 1, annee: selectedYear.value };
        const response = await ecorideService(credentials, "/statistiques/getStatistiquesForAPeriode", "GET", token);

        creditStats.value = response.filter(stat => stat.type === 'credit')
          .map(stat => {
            // Reformater la date
            const [day, month, year] = stat.date.split('-');
            const formattedDate = `${year}-${month}-${day}`;
            const date = new Date(formattedDate);
            return {
              date: date,  // Assurer que la date est un objet Date
              valeur: stat.valeur,
            };
          });

        renderChart();
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques", error);
      }
    };


    const renderChart = () => {
      const labels = creditStats.value.map(stat => {
        const statDate = new Date(stat.date);
        const month = statDate.getMonth() + 1;
        const day = statDate.getDate();

        // Formater jour et mois avec un zéro devant si nécessaire
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}/${formattedMonth}`; // Format "jour/mois"
      });

      const values = creditStats.value.map(stat => {
        console.log(stat.valeur)
        return stat.valeur;
      });

      if (currentChart) {
        currentChart.destroy();
      }

      const ctx = document.getElementById('creditChart').getContext('2d');
      currentChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Crédits',
            data: values,
            borderColor: '#385C05',
            fill: false,
            tension: 0.1,
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date (Jour/Mois)',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Crédit',
              },
              beginAtZero: true,
            },
          },
        },
      });
    };

    onMounted(() => {
      afficherStatistiques();
      rechercheEmployes();
    });

    return {
      users,
      filteredUsers,
      searchQuery,
      selectedMonth,
      selectedYear,
      months,
      years,
      creditStats,
      filteredStats,
      rechercheEmployes,
      isEmployesLoading,
      selectedUtilisateurId,
      changerStatutUtilisateur,
      openSignUpModal,
      closeSignUpModal,
      isModalSignUpVisible,
      creerEmploye,
      afficherStatistiques,
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.stats-section {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

select {
  padding: 5px;
  margin-right: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}

.chart {
  margin-top: 20px;
}

select,
button {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.month-select {
  margin-right: 1em;
}
</style>
