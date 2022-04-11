<template>
  <!-- nell index è comodo mettere la navigazione dell'app -->
  <div>
    <v-app>
      <div
        class="my-navbar d-flex justify-content-between align-items-center"
      ></div>

      <div class="mainBox">
        <!--  -->
        <transition name="fade">
          <router-view v-if="loaded"></router-view>
        </transition>

        <!--  -->
        <global-message
          v-if="globalMessage"
          :globalMex="globalMessage"
          :error="false"
        ></global-message>

        <!--  -->
        <div v-if="!loaded" class="splash-box">
          <img
            class="rotating"
            src="../public/img/icons/favicon_32x32.png"
            alt=""
          />
        </div>
        <div
          id="footer"
          class="d-flex justify-content-center align-items-center flex-column"
        >
          <select-locale class="langVSelect"></select-locale>
          <select-locale class="langVSelectMobile"></select-locale>

          <div class="footer">
            App made with Firebase and VueJs
            <i class="fab fa-vuejs"></i>
          </div>
        </div>
      </div>
    </v-app>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  // this can be used alternatively to the meta in the head of index.html page, for seo purpose
  metaInfo: {
    title: "test-app",
    titleTemplate: "%s - test-app",
    htmlAttrs: {
      lang: "en",
      amp: true,
    },
  },
  data() {
    return {
      test: true,
      loaded: false,
    };
  },
  async created() {
    this.loaded = true;
    console.log(process.env.VUE_APP_TITLE);

    // carico l utente firebase dopo il refresh
    this.$store.dispatch("loadFirebaseUserAfterRefresh");
    this.$store.commit("getUserOnRefresh");

    // prendo l userRole nello storage
    this.$store.commit("getUserRole");
  },
  computed: {
    ...mapState({
      isLoggedIn: "isLoggedIn",
      userRole: "userRole",
      globalMessage: "globalMessage",
    }),
  },

  methods: {
    async logout() {
      this.$store.dispatch("signOut");
    },
  },
};
</script>
<style lang="scss">
</style>
