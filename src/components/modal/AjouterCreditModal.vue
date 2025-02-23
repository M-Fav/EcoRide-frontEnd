<template>
    <div>
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <h2>Choisissez un montant</h2>
                <hr class="modal-divider">
                <button v-for="amount in [5, 10, 20]" :key="amount" @click="ajouterCredit(amount)" class="btn-vert">
                    +{{ amount }} <img src="../../assets/images/leaf.png" class="credit-icon" />
                </button>
                <button @click="closeModal" class="btn-rouge btn-close-position">Fermer</button>
            </div>
        </div>
    </div>
</template>

<script>

import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { ecorideService } from "@/services/backend-api.js";

export default {
    props: {
        showModal: Boolean,
    },
    setup(props, { emit }) {

        const authStore = useAuthStore();
        const utilisateurId = computed(() => authStore.user.utilisateurId);
        const token = computed(() => authStore.token);
        const user = computed(() => authStore.user);

        const closeModal = () => {
            emit("close");
        };

        const ajouterCredit = async (amount) => {
            const credentials = {
            utilisateurId: utilisateurId.value,
            credit: amount,
        };
        await ecorideService(credentials, "/utilisateur/ajouterCredit", "PUT", token.value);
        user.value.credit += amount;
            closeModal();
        };

        return { closeModal, ajouterCredit };
    }
};
</script>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.credit-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

</style>