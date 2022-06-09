<template>
  <div class="p-grid">
    <div class="p-col-6">6</div>
    <div class="p-col-6">6</div>
    <div class="p-col-6">6</div>
    <div class="p-col-6">6</div>
  </div>
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

  <Dialog
    header="Header"
    footer="Footer"
    v-model:visible="displaySubmitSuccessModal"
  >
    ثبت با موفقیت انجام شد
  </Dialog>

  <Dialog
    header="Header"
    footer="Footer"
    v-model:visible="displaySelectPortalModal"
  >
    شبکه را انتخاب کنید
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import axios from "axios";
import { PortalModel } from "@/models/PortalModel";
import { ShiftLocationModel } from "@/models/ShifLocationModel";

export default defineComponent({
  name: "ShiftLocation",
  data() {
    return {
      locationName: null,
      selectedPortal: null as PortalModel | null,
      portals: [],
      displaySubmitSuccessModal: false,
      displaySelectPortalModal: false,
    };
  },
  mounted() {
    this.getPortals();
  },

  methods: {
    submitLocation(event: Event) {
      if (this.selectedPortal == null) {
        this.displaySelectPortalModal = true;
        return;
      } else {
        axios
          .post<ShiftLocationModel>(
            "http://localhost:26379/api/ShiftLocation",
            {
              id: 0,
              title: this.locationName,
              portalId: this.selectedPortal.id,
            }
          )
          .then((response) => {
            //console.log(response);
            this.displaySubmitSuccessModal = true;
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
