<template>
  <div id="map">
    <!-- <MglMap :accessToken="accessToken" :mapStyle="mapStyle" /> -->
    <div v-if="!accessToken" class="splash-box">
      <v-progress-circular
        :size="70"
        color="primary"
        indeterminate
        class="splash-box-progress"
      ></v-progress-circular>
    </div>
    <MglMap
      v-if="accessToken"
      :accessToken="accessToken"
      :mapStyle.sync="mapStyle"
      :center="coordinates"
      :zoom="7"
    >
      <MglMarker
        v-for="(event, index) in wineEvents"
        :key="index"
        :coordinates="[
          event.location ? event.location.longitude : 0,
          event.location ? event.location.latitude : 0,
        ]"
        color="blue"
      >
        <MglPopup>
          {{ event.name }}
        </MglPopup>
        <i
          v-if="!event.isCellar"
          slot="marker"
          class="fas fa-wine-glass-alt markerWine"
        ></i>
        <i
          v-if="event.isCellar"
          slot="marker"
          class="fas fa-wine-bottle markerWine"
        ></i>
      </MglMarker>
    </MglMap>
  </div>
</template>

<script>
// import VueMapbox from "vue-mapbox";
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker, MglPopup } from "vue-mapbox";

export default {
  components: {
    MglMap,
    MglMarker,
    MglPopup,
  },
  props: ["events"],
  data() {
    return {
      accessToken: null,
      // mapStyle: "mapbox://styles/nisol91/ckfavr6400ebf19mrwoocgtbo",
      mapStyle: "mapbox://styles/nisol91/ck0cimiej4lt91cljcimh64p5",
      coordinates: [10, 45],
    };
  },
  methods: {},
  computed: {
    wineEvents: {
      get() {
        //   nel metodo computed get() posso anche bindare la props a un data in questo modo
        // this.err = this.errorsForm;
        // cosi posso sempre accedere col nome della computed prop (formErrors in questo caso)
        return this.events;
      },
      set() {},
    },
  },
  async created() {
    this.$store
      .dispatch("getEnvVariables")
      .then((env) => (this.accessToken = env[0].mapbox_api_key));

    // this.accessToken = env.mapbox_api_key;

    // mapboxgl.accessToken = this.token;
    // const map = new mapboxgl.Map({
    //   accessToken: this.token,
    //   container: "map", // container id
    //   style: "mapbox://styles/nisol91/ckfavr6400ebf19mrwoocgtbo", // style URL
    //   center: [11, 45], // starting position [lng, lat]
    //   zoom: 5, // starting zoom
    // });
    // const geocoder = new MapboxGeocoder({
    //   accessToken: this.token,
    //   mapboxgl: mapboxgl,
    // });
    // map.addControl(geocoder);
    // console.log(geocoder);
  },
};
</script>

<style scoped>
#map {
  height: 400px;
  width: 100%;
}
.markerWine {
  font-size: 20px;
  color: rgb(104, 41, 46);
}
</style>
