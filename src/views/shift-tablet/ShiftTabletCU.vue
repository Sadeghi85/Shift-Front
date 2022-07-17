<script lang="ts" setup>
import ShiftTabletService from "@/services/ShiftTabletService";
import useApiErrorStore from "@/stores/api-error";
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
const emit = defineEmits(["updateIsDone", "insertIsDone", "cuIsCanceled"]);

const apiErrorStore = useApiErrorStore();

// reactive state
const submitted = ref(false);

const shiftTablets = ref<InstanceType<typeof ShiftTabletViewModel>[]>();
const shiftDefinitions = ref<InstanceType<typeof ShiftDefinitionViewModel>[]>();

const state = reactive({
  shiftDefinition: ref<InstanceType<typeof ShiftDefinitionViewModel>>(),
  shiftDate: "",
  shiftWorthPercent: "",
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
        .createShiftTablet(
          new ShiftTabletInputModel({
            shiftId: v$.value.shiftDefinition.$model?.id,
            shiftDate: v$.value.shiftDate.$model,
            shiftWorthPercent: v$.value.shiftWorthPercent.$model,
          })
        )
        .then((response) => {
          //console.log(response);
          if (!response.data.success) {
            apiErrorStore.setApiErrorMessage(response.data.failureMessage);
            return;
          }

          emit("insertIsDone");

          showSuccess(t("toast.success.create"));
          resetForm();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      shiftTabletService.value
        .updateShiftTablet(
          new ShiftTabletInputModel({
            id: props.shiftTabletId,
            shiftId: v$.value.shiftDefinition.$model?.id,
            shiftDate: v$.value.shiftDate.$model,
            shiftWorthPercent: v$.value.shiftWorthPercent.$model,
          })
        )
        .then((response) => {
          //console.log(response);
          if (!response.data.success) {
            apiErrorStore.setApiErrorMessage(response.data.failureMessage);
            return;
          }

          emit("updateIsDone");

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
      await shiftDefinitionService.value.getShiftDefinitions(
        new ShiftDefinitionSearchModel({})
      )
    ).data;

    if (props.shiftTabletId == 0) {
      resetForm();
    } else {
      const shiftTablet = (
        await shiftTabletService.value.getShiftTablets(
          new ShiftTabletSearchModel({
            id: props.shiftTabletId,
          })
        )
      ).data[0];

      state.shiftDefinition = shiftDefinitions.value.find(
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
// onMounted(() => {
// });
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
                    :show-clear="true"
                    :class="{
                      'p-invalid': v$.shiftDefinition.$invalid && submitted,
                    }"
                    ><template #empty>
                      {{ t("dropdown.slot.empty") }}
                    </template></Dropdown
                  >

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
                  <PersianDatePicker
                    v-model="v$.shiftDate.$model"
                    :placeholder="t('shiftDate.title') + '*'"
                    type="date"
                    format="YYYY-MM-DD"
                    display-format="jYYYY/jMM/jDD"
                    :input-class="
                      v$.shiftDate.$invalid && submitted
                        ? 'p-inputtext p-component p-invalid'
                        : 'p-inputtext p-component '
                    "
                    :clearable="true"
                    :auto-submit="true"
                    :popover="true"
                  />
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
              <div class="col-12 mb-2 md:col-1">
                <Button
                  type="submit"
                  :label="btnSubmitLabel"
                  class="mt-4"
                  :class="btnSubmitClass"
                />
              </div>
              <div class="col-12 mb-2 md:col-1">
                <Button
                  type="button"
                  :label="t('button.cancel')"
                  class="mt-4 p-button-secondary"
                  @click.prevent="emit('cuIsCanceled')"
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
