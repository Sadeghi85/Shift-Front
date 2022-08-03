<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";

const props = defineProps({
  shiftDefinitionId: {
    type: Number,
    required: false,
    default: 0,
  },
});
const emit = defineEmits(["updateIsDone", "insertIsDone", "cuIsCanceled"]);

// reactive state
const { t } = useI18n();
const submitted = ref(false);

const apiErrorStore = useApiErrorStore();

const portals = ref<InstanceType<typeof PortalViewModel>[]>();
const shiftTypes = ref<InstanceType<typeof ShiftTypeViewModel>[]>([
  { id: 1, title: t("shift.type.regie") },
  { id: 2, title: t("shift.type.coordinator") },
]);

const state = reactive({
  shiftTitle: "",
  portal: ref<InstanceType<typeof PortalViewModel>>(),
  startTime: "",
  endTime: "",
  shiftType: ref<InstanceType<typeof ShiftTypeViewModel>>(),
});

const rules = {
  shiftTitle: { required },
  portal: { required },
  startTime: { required },
  endTime: { required },
  shiftType: { required },
};

////////
const v$ = useVuelidate(rules, state);
const portalService = ref(new PortalService());
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
    if (props.shiftDefinitionId == 0) {
      shiftDefinitionService.value
        .create(
          new ShiftDefinitionInputModel({
            title: v$.value.shiftTitle.$model,
            portalId: v$.value.portal.$model?.id,
            startTime: v$.value.startTime.$model,
            endTime: v$.value.endTime.$model,
            shiftTypeId: v$.value.shiftType.$model?.id,
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
      shiftDefinitionService.value
        .update(
          new ShiftDefinitionInputModel({
            id: props.shiftDefinitionId,
            title: v$.value.shiftTitle.$model,
            portalId: v$.value.portal.$model?.id,
            startTime: v$.value.startTime.$model,
            endTime: v$.value.endTime.$model,
            shiftTypeId: v$.value.shiftType.$model?.id,
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
  state.shiftTitle = "";
  state.portal = undefined;
  state.startTime = "";
  state.endTime = "";
  state.shiftType = undefined;

  submitted.value = false;
};

const fillForm = async () => {
  try {
    // portals
    portals.value = (
      await portalService.value.getAll(new PortalSearchModel({}))
    ).data;

    if (props.shiftDefinitionId == 0) {
      resetForm();
    } else {
      const shiftDefinition = (
        await shiftDefinitionService.value.getAll(
          new ShiftDefinitionSearchModel({
            id: props.shiftDefinitionId,
          })
        )
      ).data[0];

      state.shiftTitle = shiftDefinition.title;
      state.portal = portals.value.find(
        (p) => p.id == shiftDefinition.portalId
      );
      state.startTime = shiftDefinition.startTime;
      state.endTime = shiftDefinition.endTime;
      state.shiftType = shiftTypes.value.find(
        (s) => s.title == shiftDefinition.shiftTypeTitle
      );
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
  if (props.shiftDefinitionId == 0) {
    return t("button.create");
  } else {
    return t("button.update");
  }
});
const btnSubmitClass = computed(() => {
  if (props.shiftDefinitionId == 0) {
    return "p-button-primary";
  } else {
    return "p-button-warning";
  }
});

watch(
  () => props.shiftDefinitionId,
  async (shiftDefinitionId, prevShiftDefinitionId) => {
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
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="portal"
                    v-model="v$.portal.$model"
                    :options="portals"
                    option-label="title"
                    :filter="true"
                    :show-clear="true"
                    :class="{ 'p-invalid': v$.portal.$invalid && submitted }"
                    ><template #empty>
                      {{ t("dropdown.slot.empty") }}
                    </template></Dropdown
                  >

                  <label
                    for="portal"
                    :class="{
                      'p-error': v$.portal.$invalid && submitted,
                    }"
                    >{{ t("portal.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="shiftType"
                    v-model="v$.shiftType.$model"
                    :options="shiftTypes"
                    option-label="title"
                    :show-clear="true"
                    :class="{
                      'p-invalid': v$.shiftType.$invalid && submitted,
                    }"
                    ><template #empty>
                      {{ t("dropdown.slot.empty") }}
                    </template></Dropdown
                  >

                  <label
                    for="shiftType"
                    :class="{
                      'p-error': v$.shiftType.$invalid && submitted,
                    }"
                    >{{ t("shiftType.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>

              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <PersianDatePicker
                    v-model="v$.startTime.$model"
                    :placeholder="t('shift.startTime') + '*'"
                    type="time"
                    format="HH:mm:00"
                    display-format="HH:mm"
                    :input-class="
                      v$.startTime.$invalid && submitted
                        ? 'p-inputtext p-component p-invalid'
                        : 'p-inputtext p-component '
                    "
                    :compact-time="true"
                    :clearable="true"
                    :auto-submit="true"
                    :popover="true"
                    :editable="true"
                  />
                </div>
              </div>
              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <PersianDatePicker
                    v-model="v$.endTime.$model"
                    :placeholder="t('shift.endTime') + '*'"
                    type="time"
                    format="HH:mm:00"
                    display-format="HH:mm"
                    :input-class="
                      v$.endTime.$invalid && submitted
                        ? 'p-inputtext p-component p-invalid'
                        : 'p-inputtext p-component '
                    "
                    :compact-time="true"
                    :clearable="true"
                    :auto-submit="true"
                    :popover="true"
                    :editable="true"
                  />
                </div>
              </div>
            </div>

            <div class="grid align-center">
              <div class="col-12 mb-4 md:col-1">
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
