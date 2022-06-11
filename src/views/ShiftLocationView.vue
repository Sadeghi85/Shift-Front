<template>
  <div class="form-demo">
    <div class="flex justify-content-center">
      <div class="card">
        <h5 class="text-center">Register</h5>
        <form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid">
          <div class="field">
            <div class="p-float-label">
              <InputText
                id="locationName"
                v-model="v$.locationName.$model"
                :class="{ 'p-invalid': v$.locationName.$invalid && submitted }"
              />
              <label
                for="locationName"
                :class="{ 'p-error': v$.locationName.$invalid && submitted }"
                >نام لوکیشن*</label
              >
            </div>
          </div>
          <div class="field">
            <div class="p-float-label">
              <Dropdown
                id="portal"
                v-model="v$.portal.$model"
                :options="portals"
                optionLabel="title"
                :class="{ 'p-invalid': v$.portal.$invalid && submitted }"
                placeholder="شبکه را انتخاب کنید"
              />
            </div>
          </div>
          <Button type="submit" label="Submit" class="mt-2" />
        </form>
      </div>
    </div>
  </div>

  <!-- <div class="layout-content">
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
  </div> -->

  <div class="layout-content">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <DataTable :value="shiftLocations" :loading="loading">
            <Column field="id" header="Id"></Column>
            <Column field="title" header="Title"></Column>
            <Column field="portalId" header="PortalId"></Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>

  <Toast position="top-center" group="br" />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onBeforeMount } from "vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import PortalService from "@/services/PortalService";
import ShiftLocationService from "@/services/ShiftLocationService";
import { usePortalStore } from "@/stores/portal";
import { PortalModel } from "@/models/PortalModel";
import { useToast } from "primevue/usetoast";
import { ShiftLocationModel } from "@/models/ShifLocationModel";

// reactive state
//const locationName = ref("");
//const selectedPortal = ref<PortalModel>();

const submitted = ref(false);
const portals = ref<PortalModel[]>();
const shiftLocations = ref<ShiftLocationModel[]>();
const loading = ref(true);

const state = reactive({
  locationName: "",
  portal: {} as PortalModel,
});

const rules = {
  locationName: { required },
  portal: { required },
};

////////
const v$ = useVuelidate(rules, state);
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
/* const showInputError = () => {
  toast.add({
    severity: "error",
    summary: "پیغام",
    detail: "فیلدها را پر کنید",
    life: 3000,
    group: "br",
  });
}; */

// functions that mutate state and trigger updates
const handleSubmit = (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  } else {
    shiftLocationService.value
      .createShiftLocation({
        id: 0,
        title: v$.value.locationName.$model,
        portalId: v$.value.portal.$model!.id,
      })
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        loadShiftLocations();
        showSuccess();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const resetForm = () => {
  state.locationName = "";
  state.portal = {} as PortalModel;
  submitted.value = false;
};

/* function submitLocation(event: Event) {
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
} */

function loadShiftLocations() {
  loading.value = true;
  shiftLocationService.value
    .getShiftLocations()
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftLocations.value = response.data.data;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadPortals() {
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
}

// lifecycle hooks
onMounted(() => {
  //console.log(`The initial count is ${count.value}.`);
  //new InitialCalls();

  // shiftLocations
  loadShiftLocations();

  // portals
  loadPortals();
});
</script>

<style lang="scss" scoped></style>
