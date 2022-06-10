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

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { InitialCalls } from "@/http-client/initial-calls";
import { Api } from "@/http-client/api";
import { usePortalStore } from "@/stores/portal";
import { PortalModel } from "@/models/PortalModel";
import { ShiftLocationModel } from "@/models/ShifLocationModel";
import { ApiResponseModel } from "@/models/ApiResponseModel";

const api = Api.getInstance();
const portalStore = usePortalStore();

// reactive state
const locationName = ref("");
const selectedPortal = ref<PortalModel>();
const portals = ref<PortalModel[]>();
const displaySubmitSuccessModal = ref(false);
const displaySelectPortalModal = ref(false);

// functions that mutate state and trigger updates
function submitLocation(event: Event) {
  if (selectedPortal.value == null || locationName.value == null) {
    displaySelectPortalModal.value = true;
    return;
  } else {
    api
      .createShiftLocation({
        id: 0,
        title: locationName.value,
        portalId: selectedPortal.value.id,
      })
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        displaySubmitSuccessModal.value = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// lifecycle hooks
onBeforeMount(() => {
  //console.log(`The initial count is ${count.value}.`);
  //new InitialCalls();
  if (portalStore.portals.length == 0) {
    api
      .getPortals()
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        portalStore.setPortals(response.data.data);
        portals.value = portalStore.portals;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    portals.value = portalStore.portals;
  }
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
