<script lang="ts" setup>
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ShiftProductionTypeService from "@/services/ShiftProductionTypeService";
import useApiErrorStore from "@/stores/api-error";
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
const emit = defineEmits(["reloadGrid", "closeForm"]);

const apiErrorStore = useApiErrorStore();

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
const showSuccess = (detail: string) => {
  toast.add({
    severity: "success",
    summary: t("toast.header.general"),
    detail: detail,
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
    if (props.shiftProductionTypeId == 0) {
      shiftProductionTypeService.value
        .createShiftProductionType({
          id: 0,
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
          showSuccess(t("toast.success.create"));
          resetForm();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      shiftProductionTypeService.value
        .updateShiftProductionType({
          id: props.shiftProductionTypeId,
          title: v$.value.productionTypeTitle.$model,
        } as ShiftProductionTypeInputModel)
        .then((response) => {
          //console.log(response);
          if (!response.data.success) {
            throw new Error(
              "Failed api call: [" + response.data.failureMessage + "]"
            );
          }

          emit("closeForm");
          emit("reloadGrid");
          showSuccess(t("toast.success.update"));
          resetForm();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};

const resetForm = () => {
  state.productionTypeTitle = "";
  submitted.value = false;
};

const fillForm = async () => {
  try {
    if (props.shiftProductionTypeId == 0) {
      resetForm();
    } else {
      const shiftProductionType = (
        await shiftProductionTypeService.value.getShiftProductionTypes({
          pageSize: 1,
          pageNo: 0,
          id: props.shiftProductionTypeId,
          orderKey: "id",
        } as ShiftProductionTypeSearchModel)
      ).data[0];

      state.productionTypeTitle = shiftProductionType.title;
    }
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
};

const btnSubmitLabel = computed(() => {
  if (props.shiftProductionTypeId == 0) {
    return t("button.create");
  } else {
    return t("button.update");
  }
});
const btnSubmitClass = computed(() => {
  if (props.shiftProductionTypeId == 0) {
    return "p-button-primary";
  } else {
    return "p-button-warning";
  }
});

watch(
  () => props.shiftProductionTypeId,
  async (shiftProductionTypeId, prevShiftProductionTypeId) => {
    await fillForm();
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
                  :label="btnSubmitLabel"
                  class="mt-4"
                  :class="btnSubmitClass"
                />
              </div>
              <div class="col-12 mb-2 md:col-1 md:mb-0">
                <Button
                  type="button"
                  :label="t('button.cancel')"
                  class="mt-4 p-button-secondary"
                  @click="emit('closeForm')"
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
