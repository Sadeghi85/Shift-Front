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
                      id="shiftDefinition"
                      v-model="v$.shiftDefinition.$model"
                      :options="shiftDefinitions"
                      optionLabel="title"
                      :class="{
                        'p-invalid': v$.shiftDefinition.$invalid && submitted,
                      }"
                    />

                    <label
                      for="shiftDefinition"
                      :class="{
                        'p-error': v$.shiftDefinition.$invalid && submitted,
                      }"
                      >{{ t("shiftDefinition.title")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <Dropdown
                      id="shiftProductionType"
                      v-model="v$.shiftProductionType.$model"
                      :options="shiftProductionTypes"
                      optionLabel="title"
                      :class="{
                        'p-invalid':
                          v$.shiftProductionType.$invalid && submitted,
                      }"
                    />

                    <label
                      for="shiftProductionType"
                      :class="{
                        'p-error': v$.shiftProductionType.$invalid && submitted,
                      }"
                      >{{ t("productionType.title")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <InputText
                      id="shiftDate"
                      v-model="v$.shiftDate.$model"
                      :class="{
                        'p-invalid': v$.shiftDate.$invalid && submitted,
                      }"
                    />
                    <label
                      for="shiftDate"
                      :class="{
                        'p-error': v$.shiftDate.$invalid && submitted,
                      }"
                      >{{ t("shiftDate.title")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <InputText
                      id="shiftWorthPercent"
                      v-model="v$.shiftWorthPercent.$model"
                      :class="{
                        'p-invalid': v$.shiftWorthPercent.$invalid && submitted,
                      }"
                    />
                    <label
                      for="shiftWorthPercent"
                      :class="{
                        'p-error': v$.shiftWorthPercent.$invalid && submitted,
                      }"
                      >{{ t("shiftWorthPercent.title")
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
              :value="shiftTablets"
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
                field="shiftTitle"
                :header="t('grid.header.shiftTitle')"
              ></Column>
              <Column
                field="productionTypeTitle"
                :header="t('grid.header.productionTypeTitle')"
              ></Column>
              <Column
                field="shiftDate"
                :header="t('grid.header.shiftDate')"
              ></Column>
              <Column
                field="shiftWorthPercent"
                :header="t('grid.header.shiftWorthPercent')"
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
import ShiftTabletService from "@/services/ShiftTabletService";
import { useToast } from "primevue/usetoast";
import {
  ShiftTabletViewModel,
  ShiftTabletInputModel,
} from "@/models/ShiftTabletModels";
import {
  ShiftProductionTypeViewModel,
  ShiftProductionTypeInputModel,
} from "@/models/ShiftProductionTypeModels";
import {
  ShiftDefinitionViewModel,
  ShiftDefinitionInputModel,
} from "@/models/ShiftDefinitionModels";
import ShiftProductionTypeService from "@/services/ShiftProductionTypeService";
import ShiftDefinitionService from "@/services/ShiftDefinitionService";

const { t } = useI18n();
const pageSize = ref(10);
const pageNumber = ref(0);

const loading = ref(false);
const totalRecords = ref(0);
const submitted = ref(false);

const shiftTablets = ref<ShiftTabletViewModel[]>();
const shiftProductionTypes = ref<ShiftProductionTypeViewModel[]>();
const shiftDefinitions = ref<ShiftDefinitionViewModel[]>();

function loadShiftTablets(pageNumber: number, pageSize: number) {
  loading.value = true;

  shiftTabletService.value
    .getShiftTablets({
      pageNo: pageNumber,
      pageSize: pageSize,
      orderKey: "",
      shiftId: 0,
      shiftDate: "",
      productionTypeId: 0,
    } as ShiftTabletInputModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftTablets.value = response.data.data;
      totalRecords.value = response.data.totalCount;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}

const onPage = (event: any) => {
  pageNumber.value = event.page;
  loadShiftTablets(pageNumber.value, pageSize.value);
};

const state = reactive({
  shiftDefinition: ref<ShiftDefinitionViewModel>(),
  shiftProductionType: ref<ShiftProductionTypeViewModel>(),
  shiftDate: ref<string>(),
  shiftWorthPercent: ref<number>(),
});

const rules = {
  shiftDefinition: { required },
  shiftProductionType: { required },
  shiftDate: { required },
  shiftWorthPercent: { required },
};

const v$ = useVuelidate(rules, state);
const shiftTabletService = ref(new ShiftTabletService());
const shiftProductionTypeService = ref(new ShiftProductionTypeService());
const shiftDefinitionService = ref(new ShiftDefinitionService());

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
    shiftTabletService.value
      .createShiftTablet({
        shiftId: v$.value.shiftDefinition.$model!.id,
        productionTypeId: v$.value.shiftProductionType.$model!.id,
        shiftDate: v$.value.shiftDate.$model,
        shiftWorthPercent: v$.value.shiftWorthPercent.$model,
        shiftTime: "00:00:00",
        id: 0,
      } as ShiftTabletInputModel)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        loadShiftTablets(pageNumber.value, pageSize.value);
        showSuccess();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const resetForm = () => {
  state.shiftProductionType = ref<ShiftProductionTypeViewModel>();
  state.shiftDate = ref<string>();
  state.shiftWorthPercent = ref<number>();
  state.shiftDefinition = ref<ShiftDefinitionViewModel>();
  submitted.value = false;
};

function loadShiftProductionTypes() {
  shiftProductionTypeService.value
    .getShiftProductionTypes({
      pageNo: 0,
      pageSize: 10,
      orderKey: "",
      id: 0,
      title: "",
    } as ShiftProductionTypeInputModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftProductionTypes.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadShiftDefinitions() {
  shiftDefinitionService.value
    .getShiftDefinitions({
      pageNo: 0,
      pageSize: 10,
      orderKey: "",
      id: 0,
      title: "",
    } as ShiftDefinitionInputModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftDefinitions.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

// lifecycle hooks
onMounted(() => {
  // load shift production types
  loadShiftProductionTypes();
  // load shift definitions
  loadShiftDefinitions();

  // shiftTablets
  loadShiftTablets(pageNumber.value, pageSize.value);
});
</script>
