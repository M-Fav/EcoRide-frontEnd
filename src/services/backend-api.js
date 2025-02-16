import axios from "axios";

const API_BASE_URL = "http://localhost:8080";
//const API_BASE_URL = "https://ecoride-service-4d84c02e7cd5.herokuapp.com";

export async function openBankingService(credentials, endpoint, method) {
  try {
    console.log(`📤 Requête ${method} envoyée à ${endpoint}`);
    console.log("📦 Données envoyées :", JSON.stringify(credentials, null, 2));

       // Configuration de la requête
    const config = {
      method: method.toUpperCase(),
      url: `${API_BASE_URL}${endpoint}`,
    };

    // Si la méthode est GET, passer les données via 'params'
    if (method.toUpperCase() === "GET" && credentials) {
      config.params = credentials; // Les données seront envoyées sous forme de query params
    } else if (method.toUpperCase() !== "GET" && credentials) {
      // Pour POST, PUT, DELETE, ajouter les données dans le body
      config.data = credentials;
    }
  
      // Envoi de la requête
      const response = await axios(config);

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

