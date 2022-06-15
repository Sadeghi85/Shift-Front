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
                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <InputText
                      id="shiftTitle"
                      v-model="v$.shiftTitle.$model"
                      :class="{
                        'p-invalid': v$.shiftTitle.$invalid && submitted,
                      }"
                    />
                    <label
                      for="shiftTitle"
                      :class="{
                        'p-error': v$.shiftTitle.$invalid && submitted,
                      }"
                      >{{ t("shift.title")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>
                <div class="field col-12 mb-4 md:col-4">
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
                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <Dropdown
                      id="shiftType"
                      v-model="v$.shiftType.$model"
                      :options="shiftTypes"
                      optionLabel="title"
                      :class="{
                        'p-invalid': v$.shiftType.$invalid && submitted,
                      }"
                    />

                    <label
                      for="shiftType"
                      :class="{
                        'p-error': v$.shiftType.$invalid && submitted,
                      }"
                      >{{ t("shiftType.title")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <InputText
                      id="startTime"
                      v-model="v$.startTime.$model"
                      :class="{
                        'p-invalid': v$.startTime.$invalid && submitted,
                      }"
                    />
                    <label
                      for="startTime"
                      :class="{
                        'p-error': v$.startTime.$invalid && submitted,
                      }"
                      >{{ t("shift.startTime")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>
                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <InputText
                      id="endTime"
                      v-model="v$.endTime.$model"
                      :class="{
                        'p-invalid': v$.endTime.$invalid && submitted,
                      }"
                    />
                    <label
                      for="endTime"
                      :class="{
                        'p-error': v$.endTime.$invalid && submitted,
                      }"
                      >{{ t("shift.endTime")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>
              </div>

              <div class="grid">
                <div class="col-12 mb-4 md:col-1">
                  <Button type="submit" :label="t('button.submit')" class="" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card">
            <DataTable
              :value="shiftDefinitions"
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
                :header="t('grid.header.shiftTitle')"
              ></Column>
              <Column
                field="portalTitle"
                :header="t('grid.header.portal')"
              ></Column>
              <Column
                field="startTime"
                :header="t('grid.header.startTime')"
              ></Column>
              <Column
                field="endTime"
                :header="t('grid.header.endTime')"
              ></Column>
              <Column
                field="shiftTypeTitle"
                :header="t('grid.header.shiftTypeTitle')"
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
import { reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import PortalService from "@/services/PortalService";
import ShiftDefinitionService from "@/services/ShiftDefinitionService";
import { usePortalStore } from "@/stores/portal";
import { PortalViewModel } from "@/models/portal/PortalViewModel";
import { useToast } from "primevue/usetoast";
import { ShiftDefinitionViewModel } from "@/models/shift-location/ShiftDefinitionViewModel";
import { ShiftDefinitionInputModel } from "@/models/shift-location/ShiftDefinitionInputModel";
import { ShiftTypeViewModel } from "@/models/shift-type/ShiftTypeViewModel";

const { t } = useI18n();
const pageSize = ref(10);
const pageNumber = ref(0);

const loading = ref(false);
const totalRecords = ref(0);
const submitted = ref(false);

const shiftDefinitions = ref<ShiftDefinitionViewModel[]>();
const portals = ref<PortalViewModel[]>();
const shiftTypes = ref<ShiftTypeViewModel[]>([
  { id: 1, title: t("shift.type.regie") },
  { id: 2, title: t("shift.type.coordinator") },
]);

function loadShiftDefinitions(pageNumber: number, pageSize: number) {
  loading.value = true;

  shiftDefinitionService.value
    .getShiftDefinitions({
      pageNo: pageNumber,
      pageSize: pageSize,
      portalId: 0,
      title: "",
      orderKey: "",
    } as ShiftDefinitionInputModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftDefinitions.value = response.data.data;
      totalRecords.value = response.data.totalCount;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}

const onPage = (event: any) => {
  pageNumber.value = event.page;
  loadShiftDefinitions(pageNumber.value, pageSize.value);
};

const state = reactive({
  shiftTitle: "",
  //portal: {} as PortalModel,
  portal: ref<PortalViewModel>(),
  startTime: "",
  endTime: "",
  shiftType: ref<ShiftTypeViewModel>(),
});

const rules = {
  shiftTitle: { required },
  portal: { required },
  startTime: { required },
  endTime: { required },
  shiftType: { required },
};

const v$ = useVuelidate(rules, state);
const portalService = ref(new PortalService());
const shiftDefinitionService = ref(new ShiftDefinitionService());
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

const handleSubmit = (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  } else {
    shiftDefinitionService.value
      .createShiftDefinition({
        title: v$.value.shiftTitle.$model,
        portalId: v$.value.portal.$model!.id,
        startTime: v$.value.startTime.$model,
        endTime: v$.value.endTime.$model,
        shiftType: v$.value.shiftType.$model!.id,
      } as ShiftDefinitionInputModel)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        loadShiftDefinitions(pageNumber.value, pageSize.value);
        showSuccess();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const resetForm = () => {
  state.shiftTitle = "";
  //state.portal = {} as PortalModel;
  state.portal = ref<PortalViewModel>();
  state.startTime = "";
  state.endTime = "";
  state.shiftType = ref<ShiftTypeViewModel>();
  submitted.value = false;
};

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
  // portals
  loadPortals();

  // shiftDefinitions
  loadShiftDefinitions(pageNumber.value, pageSize.value);
});
</script>
