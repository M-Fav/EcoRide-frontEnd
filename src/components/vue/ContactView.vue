<template>
    <div class="contact-container">
        <div class="contact-info">
            <h2>{{ getDonneeEntreprise("nomEntreprise")?.valeur || "Nom indisponible" }}</h2>
            <p><strong>Adresse:</strong> {{ getDonneeEntreprise("siegeSocial")?.valeur || "Adresse indisponible" }}</p>
            <p><strong>Email:</strong> {{ getDonneeEntreprise("email")?.valeur || "Email indisponible" }}</p>
            <p><strong>Téléphone:</strong> {{ getDonneeEntreprise("telephone")?.valeur || "Téléphone indisponible" }}
            </p>
        </div>
        <img src="../../assets/images/ImageContact.png" class="image" />
    </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { ecorideService } from "@/services/backend-api";

export default {
    name: 'ContactView',
    setup() {
        let data = ref([]);

        const getDonneeEntreprise = (libelle) => {
            return data.value.find(item => item.libelle === libelle) || null;
        };

        const getAllDonneesEntreprise = async () => {
            try {
                data.value = await ecorideService("", "/donneesEntreprise", "GET");
                console.log("Données récupérées :", data.value);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
                data.value = [];
            }
        };

        onMounted(getAllDonneesEntreprise);

        return {
            data,
            getDonneeEntreprise,
        };
    },
};
</script>

<style scoped>
.contact-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    gap: 20px;
}

.contact-info,
.image {
    width: 400px;
    height: 300px;
    padding: 20px;
}

.contact-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
}
</style>
