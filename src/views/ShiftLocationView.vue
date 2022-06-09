<template>
  <div class="p-fluid p-formgrid p-grid">
    <div class="p-field p-col">
      <label for="firstname1">نام لوکیشن</label>
      <InputText id="locationName" type="text" v-model="locationName" />
    </div>

    <div class="p-field p-col">
      <label for="firstname1">شبکه</label>
      <Dropdown
        v-model="selectedPortal"
        :options="portals"
        optionLabel="title"
        placeholder="شبکه را انتخاب کنید"
      />
    </div>
    <Button label="ذخیره" @click.prevent="submitLocation($event)" />
  </div>

  <Dialog header="Header" footer="Footer" v-model:visible="displayModal">
    ثبت با موفقیت انجام شد
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  name: "ShiftLocation",
  data() {
    return {
      locationName: null,
      selectedPortal: null,
      portals: [],
      displayModal: false,
    };
  },
  mounted() {
    this.getPortals();
  },

  methods: {
    submitLocation(event) {
      axios
        .post("http://localhost:26379/api/ShiftLocation", {
          id: 0,
          title: this.locationName,
          portalId: this.selectedPortal.id,
        })
        .then((response) => {
          //console.log(response);
          this.displayModal = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getPortals() {
      axios
        .get("http://localhost:26379/api/Portal")
        .then((response) => {
          //console.log(response.data);
          this.portals = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.sizes {
  .p-inputtext {
    display: block;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.field * {
  display: block;
}
</style>
