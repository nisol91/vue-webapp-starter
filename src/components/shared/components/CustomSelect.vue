<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="12" sm="6">
        <!-- <v-select
          v-model="selected"
          :items="selectCategories"
          label="Select"
          multiple
          chips
          return-object
          persistent-hint
          v-on:change="printItems"
        ></v-select> -->
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn depressed color="error" class="" @click="save">save</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["categoriesList", "selectedCategories"],
  data() {
    return {
      selected: [],
      categories: [],
    };
  },
  created() {
    // faccio coincidere il mio data con la computed che prende in ingresso la prop e la monitora se cambia:D
    // this.selected = this.preselectCats;
  },
  computed: {
    // preselectCats: {
    //   get() {
    //     //   ricorda sempre di metterli entrambi sia i due this che il return.
    //     //  inoltre ricorda sempre nel componente child di mettere un bel v-if che se non ci sono ancora i
    //     // dati chiamati asincronamente, non si renderizza, cosi evito che gli vengano passati come dato un array vuoto.
    //     this.selected = this.selectedCategories;
    //     return this.selectedCategories;
    //   },
    // },
    // tutte le categorie della select (prendo solo i nomi)
    // selectCategories: {
    //   get() {
    //     //   prendo solo il nome dalle categories
    //     const cat = [];
    //     this.categoriesList.forEach((el) => {
    //       cat.push(el.name);
    //     });
    //     this.categories = cat;
    //     return cat;
    //   },
    // },
  },
  methods: {
    save() {
      this.$emit("save-categories", this.selected);
      this.selected = [];
    },
    printItems() {
      //  console.log(this.selected);
    },
  },
};
</script>
