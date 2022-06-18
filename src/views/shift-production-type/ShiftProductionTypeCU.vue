<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ShiftProductionTypeService from "@/services/ShiftProductionTypeService";
import { useToast } from "primevue/usetoast";
import {
  ShiftProductionTypeViewModel,
  ShiftProductionTypeSearchModel,
  ShiftProductionTypeInputModel,
} from "@/models/ShiftProductionTypeModels";

const props = defineProps({
  shiftProductionTypeId: {
    type: Number,
    required: false,
    default: 0,
  },
});
const emit = defineEmits(["reloadGrid"]);

// reactive state
const submitted = ref(false);

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

        emit("reloadGrid");
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

const fillForm = (shiftProductionTypeId: number) => {
  if (shiftProductionTypeId == 0) {
    resetForm();
  } else {
    resetForm();

    const searchParams = {
      pageSize: 1,
      pageNo: 0,
      id: shiftProductionTypeId,
      orderKey: "id",
    } as ShiftProductionTypeSearchModel;

    shiftProductionTypeService.value
      .getShiftProductionTypes(searchParams)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        state.productionTypeTitle = response.data.data[0].title;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

watch(
  () => props.shiftProductionTypeId,
  (shiftProductionTypeId, prevShiftProductionTypeId) => {
    fillForm(shiftProductionTypeId);
  },
  { immediate: true }
);

// lifecycle hooks
//onMounted(() => {});
</script>

<template>
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
                      'p-invalid': v$.productionTypeTitle.$invalid && submitted,
                    }"
                  />
                  <label
                    for="productionTypeTitle"
                    :class="{
                      'p-error': v$.productionTypeTitle.$invalid && submitted,
                    }"
                    >{{ t("productionType.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
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

  <Toast position="top-center" group="br" />
</template>

<style scoped></style>
