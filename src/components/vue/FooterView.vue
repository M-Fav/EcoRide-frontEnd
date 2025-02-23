<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <p>{{ getDonneeEntreprise("formeJuridique")?.valeur + " " + getDonneeEntreprise("nomEntreprise")?.valeur }}</p>
        <p>Siège social: {{ getDonneeEntreprise("siegeSocial")?.valeur }}</p>
      </div>
      <div class="footer-center">
        <img alt="Vue logo" src="../../assets/images/logoEcoRide.png" class="footerLogo" />
      </div>
      <div class="footer-right">
        <p>Email: {{ getDonneeEntreprise("email")?.valeur }} </p>
        <p>Hébergement: {{ getDonneeEntreprise("hebergeurs")?.valeur }}</p>
      </div>
    </div>
  </footer>
</template>

<script>

import { onMounted, ref } from "vue";
import { ecorideService } from '@/services/backend-api';

export default {
  name: "FooterView",
  setup() {

    let data = ref([]);

    const getDonneeEntreprise = (libelle) => {
      return data.value.find(item => item.libelle === libelle) || null;
    }

    const getAllDonneesEntreprise = async () => {
      try {
        data.value = await ecorideService("", "/donneesEntreprise", "GET");
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        data.value = [];
      }
    }

    onMounted(getAllDonneesEntreprise);

    return {
      data,
      getDonneeEntreprise,
    };
  }
};
</script>

<style scoped>
.footer {
  background-color: #385C05;
  color: #EDEFE4;
  padding: 20px;
  text-align: center;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  border-top: 6px solid #385C05;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  font-size: large;
}

.footer-left,
.footer-right {
  flex: 1;
}

.footer-center {
  flex: 1;
  text-align: center;
}

.footerLogo {
  height: 100px;
  object-fit: contain;
}

@media screen and (max-width: 768px) {
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .footer-content {
    font-size: 9px;
  }

  .footerLogo {
    display: none;
  }

  .footer-content {
    display: inline;
  }
}
</style>