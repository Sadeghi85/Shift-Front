<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";

// interface Props {
//   LocationId?: number;
// }
// const props = withDefaults(defineProps<Props>(), {
//   LocationId: 0,
// });
const props = defineProps({
  portalLocationId: {
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

const locations = ref<InstanceType<typeof LocationViewModel>[]>();
const portals = ref<InstanceType<typeof PortalViewModel>[]>();

const state = reactive({
  location: ref<InstanceType<typeof LocationViewModel>>(),
  portal: ref<InstanceType<typeof PortalViewModel>>(),
});

const rules = {
  location: { required },
  portal: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);
const portalService = ref(new PortalService());
const locationService = ref(new LocationService());
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

    if (props.portalLocationId == 0) {
      portalLocationService.value
        .create(
          new PortalLocationInputModel({
            portalId: v$.value.portal.$model?.id,
            locationId: v$.value.location.$model?.id,
          })
        )
        .then((response) => {
          submitButtonIsLoading.value = false;

          //console.log(response);
          if (!response.data.success) {
            apiErrorStore.setApiErrorMessage(response.data.message);
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
      portalLocationService.value
        .update(
          new PortalLocationInputModel({
            id: props.portalLocationId,
            portalId: v$.value.portal.$model?.id,
            locationId: v$.value.location.$model?.id,
          })
        )
        .then((response) => {
          submitButtonIsLoading.value = false;

          //console.log(response);
          if (!response.data.success) {
            apiErrorStore.setApiErrorMessage(response.data.message);
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
  state.location = undefined;
  state.portal = undefined;

  submitted.value = false;
};

const fillForm = async () => {
  try {
    // portals
    portals.value = (
      await portalService.value.getAll(new PortalSearchModel({}))
    ).data;

    // locations
    locations.value = (
      await locationService.value.getAll(new LocationSearchModel({}))
    ).data;

    if (props.portalLocationId == 0) {
      resetForm();

      if (portals.value.length == 1) {
        state.portal = portals.value[0];
      }
    } else {
      const portalLocation = (
        await portalLocationService.value.getAll(
          new PortalLocationSearchModel({
            id: props.portalLocationId,
          })
        )
      ).data[0];

      state.portal = portals.value.find((p) => p.id == portalLocation.portalId);
      state.location = locations.value.find(
        (p) => p.id == portalLocation.locationId
      );
    }
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
};

const btnSubmitLabel = computed(() => {
  if (props.portalLocationId == 0) {
    return t("button.create");
  } else {
    return t("button.update");
  }
});
const btnSubmitClass = computed(() => {
  if (props.portalLocationId == 0) {
    return "p-button-primary";
  } else {
    return "p-button-warning";
  }
});

watch(
  () => props.portalLocationId,
  async (portalLocationId, prevPortalLocationId) => {
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
                    >{{ t("portal.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
              <div class="field col-12 mb-2 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="location"
                    v-model="v$.location.$model"
                    :options="locations"
                    option-label="title"
                    :filter="true"
                    :show-clear="true"
                    :class="{
                      'p-invalid': v$.location.$invalid && submitted,
                    }"
                    ><template #empty>
                      {{ t("dropdown.slot.empty") }}
                    </template></Dropdown
                  >

                  <label
                    for="location"
                    :class="{
                      'p-error': v$.location.$invalid && submitted,
                    }"
                    >{{ t("location.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
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
