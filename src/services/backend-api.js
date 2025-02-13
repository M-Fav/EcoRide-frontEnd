import axios from "axios";

//const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = "https://ecoride-service-4d84c02e7cd5.herokuapp.com";

// Fonction pour l'authentification
export async function loginUser(credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Une erreur est survenue.";
  }
}
