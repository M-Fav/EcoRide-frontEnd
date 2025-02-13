<template>
  <header class="header">
    <div class="header-content">
      <!--<img alt="Vue logo" src="@/assets/images/logoEcoride.png" class="headerLogo" />-->
      <!--<img alt="Vue Logo" class="headerLogo" :src="require('@/assets/images/logoEcoride.png')">-->

      <nav>
        <ul>
          <li><router-link to="/accueil">Accueil</router-link></li>
          <li><router-link to="/covoiturages">Covoiturages</router-link></li>
          <li><router-link to="/login">Connexion/Inscription</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderView",
};
</script>

<style scoped>
.header {
  background-color: #385C05;
  padding: 20px;
  height: 8em;
  position: relative;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  border-bottom: 6px solid #385C05;
}

.header-content {
  display: flex;
  justify-content: flex-start;
  align-items: center; 
  height: 100%;
  width: 100%; 
}

nav {
  margin-left: 2rem; /* Espace entre le logo et la navigation */
  display: flex;
  align-items: center; 
  align-self: flex-end;
}

ul {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

a {
  color: #EDEFE4;
  text-decoration: none;
  position: relative; /* Pour positionner la barre blanche avec ::before */
  padding: 0.5rem 0.5rem 0.5rem 1rem; 
}

a::before {
  content: "";
  position: absolute;
  left: 0; 
  top: 0;
  bottom: 0;
  width: 5px;
  background-color: #EDEFE4;
  border-radius: 10px;
  transform: scaleY(0); 
  transition: transform 0.3s ease-in-out; 
}

a:hover::before {
  transform: scaleY(1); 
}
</style>
