<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";

const props = defineProps({
  shiftDefinitionId: {
    type: Number,
    required: true,
  },
});
//const emit = defineEmits(["updateIsDone", "insertIsDone", "cuIsCanceled"]);

const generalStore = useGeneralStore();

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const confirmGroup = uuidv4();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);
const loading = ref(true);

const submitButtonIsLoading = ref(false);

const showSuccess = (detail: string) => {
  toast.add({
    severity: "success",
    summary: t("toast.header.general"),
    detail: detail,
    life: 3000,
    group: "br",
  });
};

const gridTemplateOperationMenu = ref();
const gridTemplateOperationMenuItems = ref([
  {
    label: t("grid.button.operation"),
    items: [
      {
        label: t("menu.item.delete"),
        icon: "pi pi-times",
        command: () => {
          confirm.require({
            group: confirmGroup,
            message: t("confirm.message.delete"),
            header: t("confirm.header.confirmation"),
            icon: "pi pi-exclamation-triangle",
            acceptClass: "mr-4 p-button-danger",
            rejectClass: "p-button-secondary",
            acceptLabel: t("confirm.button.accept"),
            rejectLabel: t("confirm.button.reject"),
            defaultFocus: "reject",
            accept: () => {
              shiftDefinitionTemplateService.value
                .delete(gridTemplateOperationMenu.value.data.id)
                .then(async (response) => {
                  //console.log(response);
                  if (!response.data.success) {
                    apiErrorStore.setApiErrorMessage(response.data.message);
                    return;
                  }

                  await loadShiftDefinitionTemplates();
                  showSuccess(t("toast.success.delete"));
                })
                .catch((error) => {
                  console.log(error);
                });
            },
            reject: () => {
              //console.log("reject");
            },
          });
        },
      },
    ],
  },
]);
const toggleGridTemplateOperationMenu = (event: any, data: any) => {
  gridTemplateOperationMenu.value.data = data;

  gridTemplateOperationMenu.value.toggle(event);
};

const shiftDefinitionTemplates =
  ref<InstanceType<typeof ShiftDefinitionTemplateViewModel>[]>();
const submitted = ref(false);
const jobs = ref<InstanceType<typeof JobViewModel>[]>();
const state = reactive({
  job: ref<InstanceType<typeof JobViewModel>>(),
});
const rules = {
  job: { required },
};
const v$ = useVuelidate(rules, state);
const jobService = ref(new JobService());
const shiftDefinitionTemplateService = ref(
  new ShiftDefinitionTemplateService()
);
async function loadShiftDefinitionTemplates(
  searchParams?: InstanceType<typeof ShiftDefinitionTemplateSearchModel>
) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = new ShiftDefinitionTemplateSearchModel({
        shiftId: props.shiftDefinitionId,
      });
    }

    const shiftDefinitionTemplatesResponse =
      await shiftDefinitionTemplateService.value.getAll(searchParams);

    shiftDefinitionTemplates.value = shiftDefinitionTemplatesResponse.data;

    loading.value = false;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
}
const handleTemplateSubmit = (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  } else {
    submitButtonIsLoading.value = true;

    shiftDefinitionTemplateService.value
      .create(
        new ShiftDefinitionTemplateInputModel({
          shiftId: props.shiftDefinitionId,
          jobId: v$.value.job.$model?.id,
        })
      )
      .then(async (response) => {
        submitButtonIsLoading.value = false;

        //console.log(response);
        if (!response.data.success) {
          apiErrorStore.setApiErrorMessage(response.data.message);
          return;
        }

        await loadShiftDefinitionTemplates();
        showSuccess(t("toast.success.create"));
        resetTemplateForm();
      })
      .catch((error) => {
        submitButtonIsLoading.value = false;

        console.log(error);
      });
  }
};
const resetTemplateForm = () => {
  state.job = undefined;

  submitted.value = false;
};

const handleSearch = async () => {
  await loadShiftDefinitionTemplates();
};

const loadEssentials = async () => {
  try {
    // jobs
    jobs.value = (
      await jobService.value.getAll(
        new JobSearchModel({
          //pageSize: generalStore.dropdownItemsCount,
          pageSize: 2147483647, // Int32.MaxValue
        })
      )
    ).data;

    // shiftDefinitionTemplates
    await handleSearch();
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
};

watch(
  () => props.shiftDefinitionId,
  async (shiftDefinitionId, prevShiftDefinitionId) => {
    await loadEssentials();
  },
  { immediate: true }
);

// lifecycle hooks
// onMounted(async () => {
// });
</script>

<template>
  <div class="layout-content">
    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card">
            <form
              class="p-fluid"
              autocomplete="off"
              @submit.prevent="handleTemplateSubmit(!v$.$invalid)"
            >
              <div class="grid formgrid">
                <div class="field col-12 mb-4 md:col-4">
                  <div class="p-float-label">
                    <Dropdown
                      id="job"
                      v-model="v$.job.$model"
                      :options="jobs"
                      option-label="title"
                      :filter="true"
                      :show-clear="true"
                      :class="{ 'p-invalid': v$.job.$invalid && submitted }"
                      ><template #empty>
                        {{ t("dropdown.slot.empty") }}
                      </template></Dropdown
                    >

                    <label
                      for="job"
                      :class="{
                        'p-error': v$.job.$invalid && submitted,
                      }"
                      >{{ t("shiftTabletCrew.jobTitle")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-2">
                  <Button
                    type="submit"
                    :loading="submitButtonIsLoading"
                    :label="t('button.create')"
                    class="p-button-primary"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12">
          <div class="card">
            <DataTable
              :value="shiftDefinitionTemplates"
              data-key="id"
              :loading="loading"
              show-gridlines
              striped-rows
              responsive-layout="scroll"
            >
              <Column
                :header="t('grid.header.index')"
                header-style="width: 8em;"
                header-class="align-center"
                body-style="text-align: center;"
              >
                <template #body="slotProps">
                  <div>
                    {{ pageNumber * pageSize + slotProps.index + 1 }}
                  </div>
                </template></Column
              >

              <Column
                field="jobTitle"
                :header="t('grid.header.jobTitle')"
              ></Column>

              <Column
                header-style="width: 8em;"
                header-class="align-center"
                body-style="text-align: center;"
              >
                <template #header>
                  <span>{{ t("grid.button.operation") }}</span>
                </template>
                <template #body="slotProps">
                  <Button
                    type="button"
                    class="p-button-rounded p-button-secondary"
                    icon="pi pi-cog"
                    @click.prevent="
                      toggleGridTemplateOperationMenu($event, slotProps.data)
                    "
                  />
                </template>
              </Column>
              <template #empty>
                {{ t("grid.slot.empty") }}
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Menu
    id="grid_template_operation_menu"
    ref="gridTemplateOperationMenu"
    :model="gridTemplateOperationMenuItems"
    :popup="true"
  />

  <ConfirmDialog position="top-center" :group="confirmGroup" />
</template>
<style lang="scss" scoped></style>
