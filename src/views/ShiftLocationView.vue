<template>
  <div class="form">
    <div class="flex justify-content-center">
      <div class="card">
        <div class="field">
          <div class="p-float-label">
            <InputText id="locationName" type="text" v-model="locationName" />
            <label for="locationName">نام لوکیشن</label>
          </div>
        </div>

        <div class="field">
          <div class="p-float-label">
            <Dropdown
              id="portal"
              v-model="selectedPortal"
              :options="portals"
              optionLabel="title"
              placeholder="شبکه را انتخاب کنید"
            />
            <label for="portal">شبکه</label>
          </div>
        </div>

        <Button label="ذخیره" @click.prevent="submitLocation($event)" />
      </div>
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
  </div>
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
.form {
  .card {
    min-width: 450px;

    form {
      margin-top: 2rem;
    }

    .field {
      margin-bottom: 1.5rem;
    }
  }

  @media screen and (max-width: 960px) {
    .card {
      width: 80%;
    }
  }
}
</style>
