<template>
  <div class="container">
    <!-- Texte à gauche -->
    <div class="text-section">
      <h1>Bienvenue sur notre site</h1>
      <p class="intro">
        <span class="highlight">🌿 Qui sommes-nous ?</span><br>
        Bienvenue sur <strong>[Nom de votre site]</strong>, la plateforme de covoiturage écoresponsable qui allie mobilité et respect de l’environnement. 🚗💚
      </p>
      <p>
        Nous croyons en une nouvelle manière de voyager : plus économique, plus conviviale et surtout plus durable. 
        Notre mission est de réduire l’empreinte carbone des trajets du quotidien en connectant des conducteurs et 
        des passagers partageant les mêmes valeurs.
      </p>
      <p class="highlight">Pourquoi nous choisir ?</p>
      <ul class="advantages">
        <li>✅ <strong>Moins de pollution :</strong> Réduisons ensemble les émissions de CO₂ en optimisant chaque déplacement.</li>
        <li>✅ <strong>Plus d’économies :</strong> Partagez les frais de route et rendez chaque trajet plus abordable.</li>
        <li>✅ <strong>Une communauté engagée :</strong> Rejoignez un réseau de voyageurs responsables et bienveillants.</li>
      </ul>
      <p class="conclusion">
        Ensemble, faisons de chaque kilomètre un pas vers un avenir plus vert. 🌎💙 
      </p>
    </div>

    <!-- Images à droite -->
    <div class="image-section">
      <img src="../../assets/images/logoEcoRide.png" class="image" />
      <img src="../../assets/images/logoEcoRide.png" class="image" />
    </div>
  </div>
</template>

<script>
export default {
  name: "AccueilView",
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
}

.text-section {
  width: 50%;
  padding-right: 2rem;
}

.text-section h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c7a4b;
  margin-bottom: 1rem;
}

.text-section .highlight {
  font-weight: bold;
  color: #2c7a4b;
  font-size: 1.2rem;
}

.text-section p {
  color: #333;
  font-size: 1.1rem;
  line-height: 1.6;
}

.advantages {
  list-style-type: none;
  padding: 0;
}

.advantages li {
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.conclusion {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c7a4b;
  margin-top: 1rem;
}

/* Images */
.image-section {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.image {
  width: 80%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    text-align: center;
  }

  .text-section {
    width: 100%;
    padding-right: 0;
  }

  .image-section {
    width: 100%;
  }
}

</style>
