<template>
  <div>
    <!-- il ciclo viene fatto perchè per ogni field potrebbe esserci piu di un errore, in
    realtà se c'è solo un errore, viene fatto un ciclo su un array con un unico elemento-->
    <div class="invalid-feedback" v-for="(error, index) in errors" :key="key(index)">{{ error }}</div>
  </div>
</template>
<script>
export default {
  props: ["errors"],
  methods: {
    key(index) {
      // it is only important that the key is unique
      return `validation_error_${index}_${Math.random()}`;
    },
  },
};
</script>

<style scoped>
/* questo serve per far vedere il messaggio di errore
anche se è dentro il div del componente */
.form-control.is-invalid ~ div > .invalid-feedback {
  display: block;
}
</style>
