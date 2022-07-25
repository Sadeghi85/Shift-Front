<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";

// interface Props {
//   LocationId?: number;
// }
// const props = withDefaults(defineProps<Props>(), {
//   LocationId: 0,
// });
const props = defineProps({
  locationId: {
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
const locationService = ref(new LocationService());

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
    if (props.locationId == 0) {
      locationService.value
        .createLocation(
          new LocationInputModel({
            title: v$.value.locationName.$model,
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
      locationService.value
        .updateLocation(
          new LocationInputModel({
            id: props.locationId,
            title: v$.value.locationName.$model,
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

    if (props.locationId == 0) {
      resetForm();
    } else {
      const Location = (
        await locationService.value.getLocations(
          new LocationSearchModel({
            id: props.locationId,
          })
        )
      ).data[0];

      state.locationName = Location.title;
      //state.portal = portals.value.find((p) => p.id == Location.portalId);
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
  if (props.locationId == 0) {
    return t("button.create");
  } else {
    return t("button.update");
  }
});
const btnSubmitClass = computed(() => {
  if (props.locationId == 0) {
    return "p-button-primary";
  } else {
    return "p-button-warning";
  }
});

watch(
  () => props.locationId,
  async (locationId, prevLocationId) => {
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

            <div class="grid align-center">
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
