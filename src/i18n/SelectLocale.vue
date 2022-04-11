<template>
  <div>
    <v-select v-model="$i18n.locale" :items="langs"></v-select>
  </div>
</template>

<script>
export default {
  name: "SelectLocale",
  data() {
    return { langs: ["en", "it"] };
  },
  created() {
    //   console.log(`locale -> ${this.$i18n.locale}`);
  },
};
</script>
