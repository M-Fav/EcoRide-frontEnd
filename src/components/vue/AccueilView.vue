<template>
  <div class="container">
    <!-- Texte à gauche -->
    <div class="text-section">
      <h1>Bienvenue sur notre site</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. 
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tortor justo, faucibus quis viverra eget, aliquam vel ex.
        Duis quis lectus nunc. Aenean ut purus consequat, facilisis nulla vel, cursus elit. Aliquam semper a massa in dignissim. 
        Ut lobortis eros at turpis feugiat, id semper quam sodales. Proin ligula magna, bibendum quis egestas condimentum, semper id eros.
        Integer ac dui id dolor cursus ornare a non ipsum. Sed sit amet leo ante. Suspendisse mollis neque id faucibus ullamcorper. 
        Aliquam ex dui, vehicula ut sapien sit amet, porttitor interdum risus. Praesent in vulputate lectus, quis tristique tellus.
        Cras cursus ut lectus quis luctus. Curabitur ultricies aliquam porttitor. Integer mollis, quam quis vehicula dictum, mauris leo auctor lectus, 
        a eleifend ante sapien id risus. Mauris faucibus nibh in tristique faucibus.
      </p>
    </div>
    
    <div class="image-section">
      <img  src="../../assets/images/logoEcoRide.png" class="image" />
      <img  src="../../assets/images/logoEcoRide.png" class="image" />
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
  background-color: #f5f5f5;
}

.text-section {
  width: 50%;
  padding-right: 2rem;
}

.text-section h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.text-section p {
  color: #333;
  font-size: 1rem;
}

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
</style>

