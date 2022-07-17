<script lang="ts" setup>
import PortalService from "@/services/PortalService";
import ShiftLocationService from "@/services/ShiftLocationService";
import useApiErrorStore from "@/stores/api-error";

// interface Props {
//   shiftLocationId?: number;
// }
// const props = withDefaults(defineProps<Props>(), {
//   shiftLocationId: 0,
// });
const props = defineProps({
  shiftLocationId: {
    type: Number,
    required: false,
    default: 0,
  },
});
const emit = defineEmits(["updateIsDone", "insertIsDone", "cuIsCanceled"]);

const apiErrorStore = useApiErrorStore();

// reactive state
const submitted = ref(false);

const portals = ref<InstanceType<typeof PortalViewModel>[]>();

const state = reactive({
  locationName: "",
  portal: ref<InstanceType<typeof PortalViewModel>>(),
});

const rules = {
  locationName: { required },
  portal: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);
const portalService = ref(new PortalService());
const shiftLocationService = ref(new ShiftLocationService());

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
    if (props.shiftLocationId == 0) {
      shiftLocationService.value
        .createShiftLocation(
          new ShiftLocationInputModel({
            title: v$.value.locationName.$model,
            portalId: v$.value.portal.$model?.id,
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
      shiftLocationService.value
        .updateShiftLocation(
          new ShiftLocationInputModel({
            id: props.shiftLocationId,
            title: v$.value.locationName.$model,
            portalId: v$.value.portal.$model?.id,
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
  state.locationName = "";
  state.portal = undefined;

  submitted.value = false;
};

const fillForm = async () => {
  try {
    // portals
    portals.value = (
      await portalService.value.getPortals(new PortalSearchModel({}))
    ).data;

    if (props.shiftLocationId == 0) {
      resetForm();
    } else {
      const shiftLocation = (
        await shiftLocationService.value.getShiftLocations(
          new ShiftLocationSearchModel({
            id: props.shiftLocationId,
          })
        )
      ).data[0];

      state.locationName = shiftLocation.title;
      state.portal = portals.value.find((p) => p.id == shiftLocation.portalId);
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
  if (props.shiftLocationId == 0) {
    return t("button.create");
  } else {
    return t("button.update");
  }
});
const btnSubmitClass = computed(() => {
  if (props.shiftLocationId == 0) {
    return "p-button-primary";
  } else {
    return "p-button-warning";
  }
});

watch(
  () => props.shiftLocationId,
  async (shiftLocationId, prevShiftLocationId) => {
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
              <div class="col-12 mb-2 md:col-4">
                <div class="p-float-label">
                  <InputText
                    id="locationName"
                    v-model="v$.locationName.$model"
                    :class="{
                      'p-invalid': v$.locationName.$invalid && submitted,
                    }"
                  />
                  <label
                    for="locationName"
                    :class="{
                      'p-error': v$.locationName.$invalid && submitted,
                    }"
                    >{{ t("location.name")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
              <div class="field col-12 mb-2 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="portal"
                    v-model="v$.portal.$model"
                    :options="portals"
                    option-label="title"
                    :filter="true"
                    :show-clear="true"
                    :class="{
                      'p-invalid': v$.portal.$invalid && submitted,
                    }"
                    ><template #empty>
                      {{ t("dropdown.slot.empty") }}
                    </template></Dropdown
                  >

                  <label
                    for="portal"
                    :class="{
                      'p-error': v$.portal.$invalid && submitted,
                    }"
                    >{{ t("portal.name")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
            </div>

            <div class="grid formgrid">
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
