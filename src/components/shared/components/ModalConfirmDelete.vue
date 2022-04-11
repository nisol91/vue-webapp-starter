<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          delete category
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline"> confirm to delete ? </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            nooope
          </v-btn>
          <v-btn color="green darken-1" text @click="deleteCategory">
            ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    async deleteCategory() {
      this.dialog = false;
      await this.$emit("delete-category");
    },
  },
};
</script>
