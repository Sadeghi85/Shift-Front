<template>
  <div class="layout-content">
    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card">
            <form
              @submit.prevent="handleSubmit(!v$.$invalid)"
              class="p-fluid"
              autocomplete="off"
            >
              <div class="grid formgrid">
                <div class="col-12 mb-2 md:col-4 md:mb-0">
                  <div class="p-float-label">
                    <InputText
                      id="locationName"
                      v-model="v$.locationName.$model"
                      :class="{
                        'p-invalid': v$.locationName.$invalid && submitted,
                      }"
                    />
                    <label
                      for="locationName"
                      :class="{
                        'p-error': v$.locationName.$invalid && submitted,
                      }"
                      >{{ t("location.name")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>
                <div class="field col-12 mb-2 md:col-4 md:mb-0">
                  <div class="p-float-label">
                    <Dropdown
                      id="portal"
                      v-model="v$.portal.$model"
                      :options="portals"
                      optionLabel="title"
                      :class="{ 'p-invalid': v$.portal.$invalid && submitted }"
                    />

                    <label
                      for="portal"
                      :class="{
                        'p-error': v$.portal.$invalid && submitted,
                      }"
                      >{{ t("portal.name")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>
              </div>

              <div class="grid formgrid">
                <div class="col-12 mb-2 md:col-1 md:mb-0">
                  <Button
                    type="submit"
                    :label="t('button.submit')"
                    class="mt-4"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12">
          <div class="card">
            <DataTable
              :value="shiftLocations"
              :rows="10"
              dataKey="id"
              :loading="loading"
              showGridlines
              responsiveLayout="scroll"
            >
              <Column :header="t('grid.header.index')">
                <template #body="slotProps">
                  <div>
                    {{ pageNumber * pageSize + slotProps.index + 1 }}
                  </div>
                </template></Column
              >

              <Column
                field="title"
                :header="t('grid.header.location')"
              ></Column>
              <Column
                field="portalTitle"
                :header="t('grid.header.portal')"
              ></Column>
            </DataTable>

            <Paginator
              :rows="10"
              :totalRecords="totalRecords"
              @page="onPage($event)"
            ></Paginator>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Toast position="top-center" group="br" />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import PortalService from "@/services/PortalService";
import ShiftLocationService from "@/services/ShiftLocationService";
import { usePortalStore } from "@/stores/portal";
import { PortalViewModel, PortalInputModel } from "@/models/PortalModels";
import { useToast } from "primevue/usetoast";
import {
  ShiftLocationViewModel,
  ShiftLocationInputModel,
} from "@/models/ShiftLocationModels";

// reactive state
const pageSize = ref(10);
const pageNumber = ref(0);

const loading = ref(false);
const totalRecords = ref(0);
const submitted = ref(false);

const shiftLocations = ref<ShiftLocationViewModel[]>();
const portals = ref<PortalViewModel[]>();

function loadShiftLocations(pageNumber: number, pageSize: number) {
  loading.value = true;

  shiftLocationService.value
    .getShiftLocations({
      pageNo: pageNumber,
      pageSize: pageSize,
      portalId: 0,
      title: "",
      orderKey: "",
    } as ShiftLocationInputModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftLocations.value = response.data.data;
      totalRecords.value = response.data.totalCount;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}

const onPage = (event: any) => {
  pageNumber.value = event.page;
  loadShiftLocations(pageNumber.value, pageSize.value);
};

const state = reactive({
  locationName: "",
  //portal: {} as PortalModel,
  portal: ref<PortalViewModel>(),
});

const rules = {
  locationName: { required },
  portal: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);
const portalService = ref(new PortalService());
const shiftLocationService = ref(new ShiftLocationService());
const portalStore = usePortalStore();

const toast = useToast();
const showSuccess = () => {
  toast.add({
    severity: "success",
    summary: t("toast.header.general"),
    detail: t("toast.success.create"),
    life: 3000,
    group: "br",
  });
};

// functions that mutate state and trigger updates
const handleSubmit = (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  } else {
    shiftLocationService.value
      .createShiftLocation({
        title: v$.value.locationName.$model,
        portalId: v$.value.portal.$model!.id,
      } as ShiftLocationInputModel)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        loadShiftLocations(pageNumber.value, pageSize.value);
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
  //state.portal = {} as PortalModel;
  state.portal = ref<PortalViewModel>();
  submitted.value = false;
};

function loadPortals() {
  if (portalStore.portals.length == 0) {
    portalService.value
      .getPortals({
        pageNo: 0,
        pageSize: 2147483647, // Int32.MaxValue
        portalId: 0,
        title: "",
        orderKey: "",
      } as PortalInputModel)
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

  // portals
  loadPortals();

  // shiftLocations
  loadShiftLocations(pageNumber.value, pageSize.value);
});
</script>

<style lang="scss" scoped></style>
