<template>
  <div v-if="!close">
    <div class="globalMessageBox">
      <div class="globalMessage">
        <div class="globalMexText">{{ globalMex }}</div>
        <v-btn v-if="!error" color="blue" text @click="closeSnackbar">
          Close
        </v-btn>
        <v-btn v-if="error" color="red" text @click="closeErrorSnackbar">
          Close
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: { globalMex: String, error: Boolean },

  data() {
    return {
      close: false,
    };
  },
  computed: {},
  methods: {
    closeSnackbar() {
      this.$store.dispatch("closeGlobalSnackbar");
    },
    closeErrorSnackbar() {
      this.close = true;
    },
  },
};
</script>
<style lang="scss">
.globalMessageBox {
  z-index: 9999;
  position: fixed;
  height: 50px;
  width: 100vw;
  top: 85vh;
  left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  .globalMessage {
    color: white;
    background: rgb(59, 59, 61);
    // width: 50%;
    height: 100%;
    border-radius: 10px;
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    .globalMexText {
      margin: 0 5px;
    }
  }
}
</style>