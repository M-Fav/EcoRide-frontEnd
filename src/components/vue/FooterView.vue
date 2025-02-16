<template>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
          <p>Adresse table donnee_entreprise</p>
        </div>
        <div class="footer-center">
          <img alt="Vue logo" src="../../assets/images/logoEcoRide.png" class="footerLogo" />
        </div>
        <div class="footer-right">
          <p>Email: mail table donnee_entreprise</p>
          <p>Téléphone: téléphone table donnee_entreprise</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "FooterView",
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
    border-top: 6px solid #385C05;}
  
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
  </style>
  