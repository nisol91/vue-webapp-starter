<template>
  <div class="starContainer">
    <!-- l' event emitter emette l' evento $event che viene intercettato dal parent.
         esso si chiama 'input' ed emette il valore star, che di fatto è l'index di quella stela
         ovviamente il data binding è 2 way, poichè se cambia il valore che gli passa il parent, cambia il numero
    di stelle piene-->
    <i
      class="fa fa-star"
      v-for="star in fullStars"
      :key="'full' + star"
      @click="$emit('input', star)"
    ></i>
    <i
      class="far fa-star"
      v-for="star in emptyStars"
      :key="'empty' + star"
      @click="$emit('input', fullStars + star)"
    ></i>
    <i class="fas fa-star-half-alt" v-if="halfStar"></i>
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    notClickable: Boolean,
  },
  computed: {
    halfStar() {
      const fraction = Math.round((this.value - Math.floor(this.value)) * 100);
      return fraction > 0 && fraction < 50;
    },
    fullStars() {
      return Math.round(this.value);
    },
    emptyStars() {
      return 5 - Math.ceil(this.value);
    },
  },
};
</script>
<style lang="css" scoped>
.starContainer {
  display: flex;
  justify-content: flex-start;
}
</style>
