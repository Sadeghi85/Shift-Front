<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";

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
const submitButtonIsLoading = ref(false);

const shiftDefinitions = ref<InstanceType<typeof ShiftDefinitionViewModel>[]>();
const portalLocations = ref<InstanceType<typeof PortalLocationViewModel>[]>();

const state = reactive({
  shiftDefinition: ref<InstanceType<typeof ShiftDefinitionViewModel>>(),
  portalLocation: ref<InstanceType<typeof PortalLocationViewModel>>(),
  shiftDate: "",
});

const rules = {
  shiftDefinition: { required },
  portalLocation: { required },
  shiftDate: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);

const shiftTabletService = ref(new ShiftTabletService());
const shiftDefinitionService = ref(new ShiftDefinitionService());
const portalLocationService = ref(new PortalLocationService());

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
    submitButtonIsLoading.value = true;

    if (props.shiftTabletId == 0) {
      shiftTabletService.value
        .create(
          new ShiftTabletInputModel({
            shiftId: v$.value.shiftDefinition.$model?.id,
            locationId: v$.value.portalLocation.$model?.locationId,
            shiftDate: v$.value.shiftDate.$model,
          })
        )
        .then((response) => {
          submitButtonIsLoading.value = false;

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
          submitButtonIsLoading.value = false;

          console.log(error);
        });
    } else {
      shiftTabletService.value
        .update(
          new ShiftTabletInputModel({
            id: props.shiftTabletId,
            shiftId: v$.value.shiftDefinition.$model?.id,
            locationId: v$.value.portalLocation.$model?.locationId,
            shiftDate: v$.value.shiftDate.$model,
          })
        )
        .then((response) => {
          submitButtonIsLoading.value = false;

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
          submitButtonIsLoading.value = false;

          console.log(error);
        });
    }
  }
};

const resetForm = () => {
  state.shiftDate = "";
  state.shiftDefinition = undefined;
  state.portalLocation = undefined;

  submitted.value = false;
};

const fillForm = async () => {
  try {
    // load shift definitions
    shiftDefinitions.value = (
      await shiftDefinitionService.value.getAll(
        new ShiftDefinitionSearchModel({})
      )
    ).data;

    portalLocations.value = (
      await portalLocationService.value.getAll(
        new PortalLocationSearchModel({})
      )
    ).data;

    if (props.shiftTabletId == 0) {
      resetForm();
    } else {
      const shiftTablet = (
        await shiftTabletService.value.getAll(
          new ShiftTabletSearchModel({
            id: props.shiftTabletId,
          })
        )
      ).data[0];

      state.shiftDefinition = shiftDefinitions.value.find(
        (p) => p.id == shiftTablet.shiftId
      );

      state.portalLocation = portalLocations.value.find(
        (p) => p.locationId == shiftTablet.locationId
      );

      state.shiftDate = shiftTablet.shiftDate;
    }
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
};

const onDropdownShiftDefinitionChange = async (event: any) => {
  try {
    portalLocations.value = (
      await portalLocationService.value.getAll(
        new PortalLocationSearchModel({
          portalId: event.value.portalId,
        })
      )
    ).data;
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
              <div class="field col-12 mb-4 md:col-3">
                <div class="p-float-label">
                  <Dropdown
                    id="shiftDefinition"
                    v-model="v$.shiftDefinition.$model"
                    :options="shiftDefinitions"
                    option-label="displayLabel"
                    :show-clear="true"
                    :class="{
                      'p-invalid': v$.shiftDefinition.$invalid && submitted,
                    }"
                    @change="onDropdownShiftDefinitionChange"
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

              <div class="field col-12 mb-4 md:col-3">
                <div class="p-float-label">
                  <Dropdown
                    id="portalLocation"
                    v-model="v$.portalLocation.$model"
                    :options="portalLocations"
                    option-label="locationTitle"
                    :show-clear="true"
                    :class="{
                      'p-invalid': v$.portalLocation.$invalid && submitted,
                    }"
                    ><template #empty>
                      {{ t("dropdown.slot.empty") }}
                    </template></Dropdown
                  >

                  <label
                    for="portalLocation"
                    :class="{
                      'p-error': v$.portalLocation.$invalid && submitted,
                    }"
                    >{{ t("location.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>

              <div class="field col-12 mb-4 md:col-3">
                <div class="p-float-label">
                  <PersianDatePicker
                    v-model="v$.shiftDate.$model"
                    :placeholder="t('shift.shiftDate') + '*'"
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
            </div>

            <div class="grid align-center">
              <div class="col-12 mb-2 md:col-1">
                <Button
                  type="submit"
                  :loading="submitButtonIsLoading"
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
