<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="isEdit"
        color="primary"
        fab
        small
        dark
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="isAdd"
        class="mx-2"
        fab
        dark
        color="indigo"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="isAdd" class="headline">add category</span>
        <span v-if="isEdit" class="headline">edit category</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-if="isAdd"
                label="add category name*"
                required
                v-model="newCatName"
              ></v-text-field>
              <!-- <div v-if="formErrors && isAdd">{{ err }}</div> -->

              <v-text-field
                v-if="isEdit"
                label="edit category name*"
                required
                v-model="editCatName"
              ></v-text-field>
              <!-- <div class="errorColor" v-if="formErrors && isEdit">
                {{ err }}
              </div> -->
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>

        <v-btn v-if="!loading" color="blue darken-1" text @click="save">
          Save
        </v-btn>
        <v-btn v-if="loading" color="blue darken-1" text> saving... </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["inputType", "editName", "errorsForm"],
  data: () => ({
    dialog: false,
    loading: false,
    err: null,
  }),
  computed: {
    //   passo un eventuale errore dal metodo del componente padre
    // formErrors: {
    //   get() {
    //     //   nel metodo computed get() posso anche bindare la props a un data in questo modo
    //     this.err = this.errorsForm;
    //     // cosi posso sempre accedere col nome della computed prop (formErrors in questo caso)
    //     return this.errorsForm;
    //   },
    //   set() {},
    // },

    //   faccio un v-model con un computed con get() e set(), esattamente come si fa con un data
    editCatName: {
      // prendo il valore di input dalle props (che vengono dal padre)
      get() {
        return this.editName;
      },
      //  emetto come input il valore verso il padre
      set(value) {
        this.$emit("input", value);
      },
    },

    newCatName: {
      // get ci vuole sempre, set si puo anche omettere
      get() {
        return "";
      },
      //  emetto come input il valore verso il padre
      set(value) {
        this.$emit("input", value);
      },
    },
    isEdit() {
      return this.inputType === "edit";
    },
    isAdd() {
      return this.inputType === "add";
    },
  },
  methods: {
    //   se faccio riferimento a metodi async, anche questi dovranno esserli
    async save() {
      this.loading = true;
      await this.$emit("save-category");

      //  questo timeout sempre per la questione dell'async. aspetto un tempo ragionevolmente lungo prima di chiudere il dialog.
      setTimeout(() => {
        this.err = null;
        this.dialog = false;
        this.loading = false;
      }, 4000);
    },
  },
};
</script>

