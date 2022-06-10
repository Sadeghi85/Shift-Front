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
import { Api } from "@/http-client/api";
import { PortalModel } from "@/models/PortalModel";
import { ShiftLocationModel } from "@/models/ShifLocationModel";
import { ApiResponseModel } from "@/models/ApiResponseModel";

const api = Api.getInstance();

export default defineComponent({
  name: "ShiftLocation",
  data() {
    return {
      locationName: null,
      selectedPortal: null as PortalModel | null,
      portals: [] as PortalModel[],
      displaySubmitSuccessModal: false,
      displaySelectPortalModal: false,
    };
  },
  mounted() {
    this.getPortals();
  },

  methods: {
    submitLocation(event: Event) {
      if (this.selectedPortal == null || this.locationName == null) {
        this.displaySelectPortalModal = true;
        return;
      } else {
        api
          .createShiftLocation({
            id: 0,
            title: this.locationName,
            portalId: this.selectedPortal.id,
          })
          .then((response) => {
            //console.log(response);
            if (!response.data.success) {
              throw new Error(
                "Failed api call: [" + response.data.failureMessage + "]"
              );
            }

            this.displaySubmitSuccessModal = true;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    getPortals() {
      api
        .getPortals()
        .then((response) => {
          //console.log(response);
          if (!response.data.success) {
            throw new Error(
              "Failed api call: [" + response.data.failureMessage + "]"
            );
          }

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
