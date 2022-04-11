<template>
  <div v-if="show" class="d-flex justify-content-center align-items-center successBannerBox">
    <div class="successBanner">woooo, event {{bannerEventName}} addedd</div>
    <div @click="close">x</div>
  </div>
</template>

<script>
export default {
  props: { bannerEventName: String },

  data() {
    return {
      show: true,
    };
  },

  methods: {
    close() {
      this.show = false;
    },
  },
};
</script>

<style scoped>
.successBannerBox {
  width: 100%;
  background: rgb(94, 162, 94);
  height: 50px;
  border-radius: 10px;
}
.successBanner {
  color: black;
  width: 70%;
  text-align: center;
}
</style>
