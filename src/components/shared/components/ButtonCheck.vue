<template>
  <div>
    <button
      class="btn btn-secondary btn-block"
      @click="buttonCheck"
      :disabled="loading"
    >
      <span v-if="!loading">
        <slot></slot>
      </span>
      <span v-if="loading">
        <i class="fas fa-circle-notch fa-spin"></i> Checking....
      </span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    buttonCheck: Function,
  },

  created() {
    //   console.log(this.loading);
  },
};
</script>

<style scoped>
.success {
  color: grey;
  font-size: 10rem;
}
</style>
