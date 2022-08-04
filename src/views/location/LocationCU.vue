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
const submitButtonIsLoading = ref(false);

const state = reactive({
  locationTitle: "",
});

const rules = {
  locationTitle: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);
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
    submitButtonIsLoading.value = true;

    if (props.locationId == 0) {
      locationService.value
        .create(
          new LocationInputModel({
            title: v$.value.locationTitle.$model,
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
      locationService.value
        .update(
          new LocationInputModel({
            id: props.locationId,
            title: v$.value.locationTitle.$model,
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
  state.locationTitle = "";

  submitted.value = false;
};

const fillForm = async () => {
  try {
    if (props.locationId == 0) {
      resetForm();
    } else {
      const location = (
        await locationService.value.getAll(
          new LocationSearchModel({
            id: props.locationId,
          })
        )
      ).data[0];

      state.locationTitle = location.title;
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
                    id="locationTitle"
                    v-model="v$.locationTitle.$model"
                    :class="{
                      'p-invalid': v$.locationTitle.$invalid && submitted,
                    }"
                  />
                  <label
                    for="locationTitle"
                    :class="{
                      'p-error': v$.locationTitle.$invalid && submitted,
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
