<template>
  <div id="app">
    <HeaderView />
    <div class="content">
      <router-view />
    </div>
    <FooterView />
  </div>
</template>

<script>
import { provide, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import HeaderView from "./components/HeaderView.vue";
import FooterView from "./components/FooterView.vue";

export default {
  name: "App",
  components: {
    HeaderView,
    FooterView,
  },
  setup() {
    const authStore = useAuthStore();

    // Définition des valeurs réactives globales
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const user = computed(() => authStore.getUser);
    const userPhoto = computed(() => user.value?.photo || new URL("@/assets/iconeUser.png", import.meta.url).href);

    // Partage des données aux composants enfants
    provide("isAuthenticated", isAuthenticated);
    provide("user", user);
    provide("userPhoto", userPhoto);

    return {};
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
