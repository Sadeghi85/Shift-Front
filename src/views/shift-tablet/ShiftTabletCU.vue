<script lang="ts" setup>
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ShiftTabletService from "@/services/ShiftTabletService";
import useApiErrorStore from "@/stores/api-error";
import { useToast } from "primevue/usetoast";
import {
  ShiftTabletViewModel,
  ShiftTabletInputModel,
  ShiftTabletSearchModel,
} from "@/models/ShiftTabletModels";
import {
  ShiftDefinitionViewModel,
  ShiftDefinitionSearchModel,
  ShiftDefinitionInputModel,
} from "@/models/ShiftDefinitionModels";
import ShiftDefinitionService from "@/services/ShiftDefinitionService";

// interface Props {
//   shiftLocationId?: number;
// }
// const props = withDefaults(defineProps<Props>(), {
//   shiftLocationId: 0,
// });

const props = defineProps({
  shiftTabletId: {
    type: Number,
    required: false,
    default: 0,
  },
});
const emit = defineEmits(["reloadGrid", "closeForm"]);

const apiErrorStore = useApiErrorStore();

// reactive state
const submitted = ref(false);

const shiftTablets = ref<ShiftTabletViewModel[]>();
const shiftDefinitions = ref<ShiftDefinitionViewModel[]>();

const state = reactive({
  shiftDefinition: ref<ShiftDefinitionViewModel>(),
  shiftDate: ref<string>(),
  shiftWorthPercent: ref<string>(),
});

const rules = {
  shiftDefinition: { required },
  shiftDate: { required },
  shiftWorthPercent: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);

const shiftTabletService = ref(new ShiftTabletService());
const shiftDefinitionService = ref(new ShiftDefinitionService());

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
    if (props.shiftTabletId == 0) {
      shiftTabletService.value
        .createShiftTablet({
          id: 0,
          shiftId: v$.value.shiftDefinition.$model!.id,
          shiftDate: v$.value.shiftDate.$model,
          shiftWorthPercent: v$.value.shiftWorthPercent.$model,
          shiftTime: "00:00:00",
        } as ShiftTabletInputModel)
        .then((response) => {
          //console.log(response);
          if (!response.data.success) {
            apiErrorStore.setApiErrorMessage(response.data.failureMessage);
            return;
          }

          emit("reloadGrid");
          showSuccess(t("toast.success.create"));
          resetForm();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      shiftTabletService.value
        .updateShiftTablet({
          id: props.shiftTabletId,
          shiftId: v$.value.shiftDefinition.$model!.id,
          shiftDate: v$.value.shiftDate.$model,
          shiftWorthPercent: v$.value.shiftWorthPercent.$model,
          shiftTime: "00:00:00",
        } as ShiftTabletInputModel)
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
  state.shiftDate = "";
  state.shiftWorthPercent = "";
  state.shiftDefinition = undefined;

  submitted.value = false;
};

const fillForm = async () => {
  try {
    // load shift definitions
    shiftDefinitions.value = (
      await shiftDefinitionService.value.getShiftDefinitions({
        pageNo: 0,
        pageSize: 2147483647, // Int32.MaxValue
        orderKey: "",
        id: 0,
        title: "",
        desc: true,
        portalId: 0,
        shiftType: 0,
        isDeleted: false,
      } as ShiftDefinitionSearchModel)
    ).data;

    if (props.shiftTabletId == 0) {
      resetForm();
    } else {
      const shiftTablet = (
        await shiftTabletService.value.getShiftTablets({
          pageSize: 1,
          pageNo: 0,
          id: props.shiftTabletId,
          orderKey: "id",
          desc: true,
          shiftDate: "",
          shiftId: 0,
          isDeleted: false,
          fromDate: "",
          toDate: "",
        } as ShiftTabletSearchModel)
      ).data[0];

      state.shiftDefinition = shiftDefinitions.value!.find(
        (p) => p.id == shiftTablet.shiftId
      );

      state.shiftDate = shiftTablet.shiftDate;
      state.shiftWorthPercent = shiftTablet.shiftWorthPercent;
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
  if (props.shiftTabletId == 0) {
    return t("button.create");
  } else {
    return t("button.update");
  }
});
const btnSubmitClass = computed(() => {
  if (props.shiftTabletId == 0) {
    return "p-button-primary";
  } else {
    return "p-button-warning";
  }
});

watch(
  () => props.shiftTabletId,
  async (shiftTabletId, prevShiftTabletId) => {
    await fillForm();
  },
  { immediate: true }
);

// lifecycle hooks
onMounted(() => {
  // load shift production types
  //loadShiftProductionTypes();
  // load shift definitions
  //loadShiftDefinitions();
});
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
              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="shiftDefinition"
                    v-model="v$.shiftDefinition.$model"
                    :options="shiftDefinitions"
                    option-label="title"
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
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
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
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
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
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
            </div>

            <div class="grid">
              <div class="col-12 mb-4 md:col-1">
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
