<template>
  <div class="layout-content">
    <div class="grid">
      <div class="col-6 md:col-6 col-offset-3 p-fluid">
        <div class="card">
          <h5>نام لوکیشن</h5>
          <div class="grid">
            <div class="col-12 mb-2 lg:col-12 lg:mb-0">
              <InputText id="locationName" type="text" v-model="locationName" />
            </div>
          </div>
          <h5>شبکه</h5>
          <div class="grid">
            <div class="col-12 mb-2 lg:col-12 lg:mb-0">
              <Dropdown
                id="portal"
                v-model="selectedPortal"
                :options="portals"
                optionLabel="title"
                placeholder="شبکه را انتخاب کنید"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col-2 mb-2 lg:col-2 lg:mb-0 mt-2">
              <Button label="ذخیره" @click.prevent="submitLocation($event)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toast position="top-center" group="br" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from "vue";
import PortalService from "@/services/PortalService";

import ShiftLocationService from "@/services/ShiftLocationService";
import { usePortalStore } from "@/stores/portal";
import { PortalModel } from "@/models/PortalModel";
import { useToast } from "primevue/usetoast";

const portalService = ref(new PortalService());
const shiftLocationService = ref(new ShiftLocationService());
const portalStore = usePortalStore();

const toast = useToast();
const showSuccess = () => {
  toast.add({
    severity: "success",
    summary: "پیغام",
    detail: "ثبت با موفقیت انجام شد",
    life: 3000,
    group: "br",
  });
};
const showInputError = () => {
  toast.add({
    severity: "error",
    summary: "پیغام",
    detail: "فیلدها را پر کنید",
    life: 3000,
    group: "br",
  });
};

// reactive state
const locationName = ref("");
const selectedPortal = ref<PortalModel>();
const portals = ref<PortalModel[]>();

// functions that mutate state and trigger updates
function submitLocation(event: Event) {
  if (selectedPortal.value == null || locationName.value == null) {
    showInputError();
    return;
  } else {
    shiftLocationService.value
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

        showSuccess();
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
    portalService.value
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

<style lang="scss" scoped></style>
