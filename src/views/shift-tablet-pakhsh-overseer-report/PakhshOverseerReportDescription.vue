<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";
import RoleTypes from "@/enums/RoleType";

const apiErrorStore = useApiErrorStore();

const route = useRoute();

// reactive state
const submitted = ref(false);
const submitButtonIsLoading = ref(false);

const state = reactive({
  reportDescription: "",
});

const rules = {
  reportDescription: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);
const shiftTabletService = ref(new ShiftTabletService());
const shiftTabletReportService = ref(new ShiftTabletReportService());

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

    shiftTabletReportService.value
      .createOrUpdate(
        new ShiftTabletReportInputModel({
          shiftTabletId: +route.params.shiftTabletId,
          roleTypeId: RoleTypes.PakhshOverseer,
          reportDescription: v$.value.reportDescription.$model,
        })
      )
      .then((response) => {
        submitButtonIsLoading.value = false;

        //console.log(response);
        if (!response.data.success) {
          apiErrorStore.setApiErrorMessage(response.data.message);
          return;
        }

        showSuccess(t("toast.success.save"));
      })
      .catch((error) => {
        submitButtonIsLoading.value = false;

        console.log(error);
      });
  }
};

// const resetForm = () => {
//   state.reportDescription = "";

//   submitted.value = false;
// };

const fillForm = async () => {
  try {
    const shiftTabletReport = (
      await shiftTabletReportService.value.getAll(
        new ShiftTabletReportSearchModel({
          shiftTabletId: +route.params.shiftTabletId,
          roleTypeId: RoleTypes.PakhshOverseer,
        })
      )
    ).data[0];

    state.reportDescription = shiftTabletReport?.reportDescription;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
};

watch(
  () => route.params.shiftTabletId,
  async (shiftTabletId, prevShiftTabletId) => {
    if (shiftTabletId) {
      await fillForm();
    }
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
              <div class="field col-12 mb-4 md:col-12">
                <div class="p-float-label">
                  <Textarea
                    id="reportDescription"
                    v-model="v$.reportDescription.$model"
                    :auto-resize="true"
                    rows="5"
                    cols="30"
                    :class="{
                      'p-invalid': v$.reportDescription.$invalid && submitted,
                    }"
                  />
                  <label
                    for="reportDescription"
                    :class="{
                      'p-error': v$.reportDescription.$invalid && submitted,
                    }"
                    >{{ t("pakhshOverseer.report")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
            </div>

            <div class="grid align-center">
              <div class="col-12 mb-4 md:col-1">
                <Button
                  type="submit"
                  :loading="submitButtonIsLoading"
                  :label="t('button.save')"
                  class="mt-4 p-button-primary"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <Toast position="top-center" group="br" />
  </div>
</template>

<style lang="scss" scoped></style>
