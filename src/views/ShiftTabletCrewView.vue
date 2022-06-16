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
                    <Dropdown
                      id="shiftTablet"
                      v-model="v$.shiftTablet.$model"
                      :options="shiftTablets"
                      optionLabel="shiftTitle"
                      :class="{
                        'p-invalid': v$.shiftTablet.$invalid && submitted,
                      }"
                    />

                    <label
                      for="shiftTablet"
                      :class="{
                        'p-error': v$.shiftTablet.$invalid && submitted,
                      }"
                      >{{ t("shiftTablet.title")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <Dropdown
                      id="agent"
                      v-model="v$.agent.$model"
                      :options="agents"
                      optionLabel="fullName"
                      :class="{
                        'p-invalid': v$.agent.$invalid && submitted,
                      }"
                    />

                    <label
                      for="agent"
                      :class="{
                        'p-error': v$.agent.$invalid && submitted,
                      }"
                      >{{ t("agent.crew.title")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <Dropdown
                      id="resourceType"
                      v-model="v$.resourceType.$model"
                      :options="resourceTypes"
                      optionLabel="title"
                      :class="{
                        'p-invalid': v$.resourceType.$invalid && submitted,
                      }"
                    />

                    <label
                      for="resourceType"
                      :class="{
                        'p-error': v$.resourceType.$invalid && submitted,
                      }"
                      >{{ t("resourceType.crew.title")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <InputText
                      id="entranceTime"
                      v-model="v$.entranceTime.$model"
                      :class="{
                        'p-invalid': v$.entranceTime.$invalid && submitted,
                      }"
                    />
                    <label
                      for="entranceTime"
                      :class="{
                        'p-error': v$.entranceTime.$invalid && submitted,
                      }"
                      >{{ t("entranceTime.title")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <InputText
                      id="exitTime"
                      v-model="v$.exitTime.$model"
                      :class="{
                        'p-invalid': v$.exitTime.$invalid && submitted,
                      }"
                    />
                    <label
                      for="exitTime"
                      :class="{
                        'p-error': v$.exitTime.$invalid && submitted,
                      }"
                      >{{ t("exitTime.title")
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
        <div class="col-12 md:col-12">
          <div class="card">
            <DataTable
              :value="shiftTabletCrews"
              :rows="10"
              dataKey="id"
              :loading="loading"
              showGridlines
              responsiveLayout="scroll"
            >
              <template #header>
                <div class="flex justify-content-end">
                  <Button
                    type="button"
                    icon="pi pi-file-excel"
                    :label="t('button.excel')"
                    class="p-button-outlined"
                    @click.prevent="getExcel()"
                  />
                </div>
              </template>

              <Column :header="t('grid.header.index')">
                <template #body="slotProps">
                  <div>
                    {{ pageNumber * pageSize + slotProps.index + 1 }}
                  </div>
                </template></Column
              >

              <Column field="portalName" :header="t('grid.header.portal')">
              </Column>
              <Column
                field="shiftTitle"
                :header="t('grid.header.shiftTitle')"
              ></Column>
              <Column
                field="persianDate"
                :header="t('grid.header.shiftTabletDate')"
              ></Column>
              <Column
                field="agentFullName"
                :header="t('grid.header.agentFullName')"
              ></Column>
              <Column
                field="jobName"
                :header="t('grid.header.jobName')"
              ></Column>
              <Column
                field="entranceTime"
                :header="t('grid.header.entranceTime')"
              ></Column>
              <Column
                field="exitTime"
                :header="t('grid.header.exitTime')"
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
import ShiftTabletCrewService from "@/services/ShiftTabletCrewService";
import ShiftTabletService from "@/services/ShiftTabletService";
import ResourceTypeService from "@/services/ResourceTypeService";
import AgentService from "@/services/AgentService";
import { useToast } from "primevue/usetoast";
import { ShiftTabletCrewViewModel } from "@/models/shift-tablet-crew/ShiftTabletCrewViewModel";
import { ShiftTabletCrewInputModel } from "@/models/shift-tablet-crew/ShiftTabletCrewInputModel";

import { ShiftTabletViewModel } from "@/models/shift-tablet/ShiftTabletViewModel";
import { ShiftTabletInputModel } from "@/models/shift-tablet/ShiftTabletInputModel";

import { AgentViewModel } from "@/models/agent/AgentViewModel";
import { ResourceTypeViewModel } from "@/models/resource-type/ResourceTypeViewModel";
import { AgentInputModel } from "@/models/agent/AgentInputModel";
import { ResourceTypeInputModel } from "@/models/resource-type/ResourceTypeInputModel";
import { number } from "@intlify/core-base";

const { t } = useI18n();
const pageSize = ref(10);
const pageNumber = ref(0);

const loading = ref(false);
const totalRecords = ref(0);
const submitted = ref(false);

const shiftTabletCrews = ref<ShiftTabletCrewViewModel[]>();
const resourceTypes = ref<ResourceTypeViewModel[]>();
const agents = ref<AgentViewModel[]>();
const shiftTablets = ref<ShiftTabletViewModel[]>();

function loadShiftTabletCrews(pageNumber: number, pageSize: number) {
  loading.value = true;

  shiftTabletCrewService.value
    .getShiftTabletCrews({
      pageNo: pageNumber,
      pageSize: pageSize,
      orderKey: "",
      agentId: 0,
      entranceTime: "",
      exitTime: "",
      resourceTypeId: 0,
      agentName: "",
      shiftTabletDate: "",
      shiftTabletId: 0,
      id: 0,
      shiftTitle: "",
    } as ShiftTabletCrewInputModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftTabletCrews.value = response.data.data;
      totalRecords.value = response.data.totalCount;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}

const onPage = (event: any) => {
  pageNumber.value = event.page;
  loadShiftTabletCrews(pageNumber.value, pageSize.value);
};

const state = reactive({
  shiftTablet: ref<ShiftTabletViewModel>(),
  agent: ref<AgentViewModel>(),
  resourceType: ref<ResourceTypeViewModel>(),
  entranceTime: ref<string>(),
  exitTime: ref<string>(),
});

const rules = {
  shiftTablet: { required },
  agent: { required },
  resourceType: { required },
  entranceTime: { required },
  exitTime: { required },
};

const v$ = useVuelidate(rules, state);
const shiftTabletCrewService = ref(new ShiftTabletCrewService());
const shiftTabletService = ref(new ShiftTabletService());
const resourceTypeService = ref(new ResourceTypeService());
const agentService = ref(new AgentService());

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
    shiftTabletCrewService.value
      .createShiftTabletCrew({
        shiftTabletId: v$.value.shiftTablet.$model!.id,
        agentId: v$.value.agent.$model!.id,
        resourceTypeId: v$.value.resourceType.$model!.id,
        entranceTime: v$.value.entranceTime.$model,
        exitTime: v$.value.exitTime.$model,
        id: 0,
      } as ShiftTabletCrewInputModel)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        loadShiftTabletCrews(pageNumber.value, pageSize.value);
        showSuccess();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const resetForm = () => {
  state.shiftTablet = ref<ShiftTabletViewModel>();
  state.agent = ref<AgentViewModel>();
  state.entranceTime = ref<string>();
  state.exitTime = ref<string>();
  state.resourceType = ref<ResourceTypeViewModel>();
  submitted.value = false;
};

function loadResourceTypes() {
  resourceTypeService.value
    .getResourceTypes({
      pageNo: 0,
      pageSize: 10,
      orderKey: "",
      id: 0,
      resourceName: "",
    } as ResourceTypeInputModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      resourceTypes.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadAgents() {
  agentService.value
    .getAgents({
      pageNo: 0,
      pageSize: 10,
      orderKey: "",
      id: 0,
      firstName: "",
      lastName: "",
    } as AgentInputModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      agents.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadShiftTablets() {
  shiftTabletService.value
    .getShiftTablets({
      pageNo: 0,
      pageSize: 10,
      orderKey: "",
      id: 0,
    } as ShiftTabletInputModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftTablets.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const getExcel = () => {
  shiftTabletCrewService.value
    .getShiftTabletCrewExcel({
      pageNo: 0,
      pageSize: 2147483647, // Int32.MaxValue
      orderKey: "",
      agentId: 0,
      entranceTime: "",
      exitTime: "",
      resourceTypeId: 0,
      agentName: "",
      shiftTitle: "",
    } as ShiftTabletCrewInputModel)
    .then((response) => {
      //console.log(response);
      // if (!response.data.success) {
      //   throw new Error(
      //     "Failed api call: [" + response.data.failureMessage + "]"
      //   );
      // }

      //shiftTabletCrews.value = response.data.data;

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "ShiftTabletCrew.xlsx");
      link.click();
      URL.revokeObjectURL(link.href);
    })
    .catch((error) => {
      console.log(error);
    });
};

// lifecycle hooks
onMounted(() => {
  // load shift tablets
  loadShiftTablets();
  // load resource types
  loadResourceTypes();
  // load agents
  loadAgents();

  // shiftTablets
  loadShiftTabletCrews(pageNumber.value, pageSize.value);
});
</script>
