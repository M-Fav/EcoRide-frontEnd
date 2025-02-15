import axios from "axios";

const API_BASE_URL = "http://localhost:8080";
//const API_BASE_URL = "https://ecoride-service-4d84c02e7cd5.herokuapp.com";

export async function openBankingService(credentials, endpoint) {
  try {
    console.log("📤 Données envoyées :", JSON.stringify(credentials, null, 2));

    const response = await axios.post(`${API_BASE_URL}${endpoint}`, credentials);

    console.log("✅ Réponse complète :", response);
    console.log("📩 Données de la réponse :", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Erreur Axios :", error);
    if (error.response) {
      console.error("⚠️ Réponse du serveur :", error.response);
      console.error("📩 Erreur détaillée :", JSON.stringify(error.response.data, null, 2));
    }
    throw error.response?.data?.message || "Une erreur est survenue.";
  }
}
