<template>
  <div class="layout-content">
    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card">
            <form
              class="p-fluid"
              autocomplete="off"
              @submit.prevent="handleSubmit(!v$.$invalid)"
            >
              <div class="grid formgrid">
                <div class="col-12 mb-2 md:col-4 md:mb-0">
                  <div class="p-float-label">
                    <InputText
                      id="productionTypeTitle"
                      v-model="v$.productionTypeTitle.$model"
                      :class="{
                        'p-invalid':
                          v$.productionTypeTitle.$invalid && submitted,
                      }"
                    />
                    <label
                      for="productionTypeTitle"
                      :class="{
                        'p-error': v$.productionTypeTitle.$invalid && submitted,
                      }"
                      >{{ t("productionType.title")
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
              :value="productionTypes"
              :rows="10"
              data-key="id"
              :loading="loading"
              show-gridlines
              responsive-layout="scroll"
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
                :header="t('grid.header.productionType')"
              ></Column>
            </DataTable>

            <Paginator
              :rows="10"
              :total-records="totalRecords"
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
import ShiftProductionTypeService from "@/services/ShiftProductionTypeService";
import { useToast } from "primevue/usetoast";
import {
  ShiftProductionTypeViewModel,
  ShiftProductionTypeInputModel,
} from "@/models/ShiftProductionTypeModels";

// reactive state

const pageSize = ref(10);
const pageNumber = ref(0);

const loading = ref(false);
const totalRecords = ref(0);
const submitted = ref(false);

const productionTypes = ref<ShiftProductionTypeViewModel[]>();

const state = reactive({
  productionTypeTitle: "",
});

const rules = {
  productionTypeTitle: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);

const shiftProductionTypeService = ref(new ShiftProductionTypeService());

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

const onPage = (event: any) => {
  pageNumber.value = event.page;
  loadProductionTypes(pageNumber.value, pageSize.value);
};
function loadProductionTypes(pageNumber: number, pageSize: number) {
  loading.value = true;

  shiftProductionTypeService.value
    .getShiftProductionTypes({
      title: "",
    } as ShiftProductionTypeInputModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      productionTypes.value = response.data.data;
      totalRecords.value = response.data.totalCount;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}

const handleSubmit = (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  } else {
    shiftProductionTypeService.value
      .createShiftLocation({
        title: v$.value.productionTypeTitle.$model,
      } as ShiftProductionTypeInputModel)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        loadProductionTypes(pageNumber.value, pageSize.value);
        showSuccess();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const resetForm = () => {
  state.productionTypeTitle = "";
  submitted.value = false;
};

// lifecycle hooks
onMounted(() => {
  // productionTypes
  loadProductionTypes(pageNumber.value, pageSize.value);
});
</script>

<style lang="scss" scoped></style>
