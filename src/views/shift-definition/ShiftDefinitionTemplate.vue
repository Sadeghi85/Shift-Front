<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import PortalService from "@/services/PortalService";
import ShiftDefinitionService from "@/services/ShiftDefinitionService";
import useApiErrorStore from "@/stores/api-error";
import { PortalSearchModel, PortalViewModel } from "@/models/PortalModels";
import { useToast } from "primevue/usetoast";
import {
  ShiftDefinitionViewModel,
  ShiftDefinitionInputModel,
  ShiftDefinitionSearchModel,
} from "@/models/ShiftDefinitionModels";
import { ShiftTypeViewModel } from "@/models/ShiftTypeModels";

import ShiftDefinitionCU from "@/views/shift-definition/ShiftDefinitionCU.vue";
import { useConfirm } from "primevue/useconfirm";
import { useGeneralStore } from "@/stores/general";
import ResourceTypeService from "@/services/ResourceTypeService";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  ResourceTypeSearchModel,
  ResourceTypeViewModel,
} from "@/models/ResourceTypeModels";
import ShiftDefinitionTemplateService from "@/services/ShiftDefinitionTemplateService";
import {
  ShiftDefinitionTemplateInputModel,
  ShiftDefinitionTemplateSearchModel,
  ShiftDefinitionTemplateViewModel,
} from "@/models/ShiftDefinitionTemplateModels";

const props = defineProps({
  shiftDefinitionId: {
    type: Number,
    required: true,
    default: 0,
  },
});
//const emit = defineEmits(["updateIsDone", "insertIsDone", "cuIsCanceled"]);

const generalStore = useGeneralStore();

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);
const loading = ref(false);
const totalRecords = ref(0);

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
                .deleteShiftDefinitionTemplate({
                  id: gridTemplateOperationMenu.value.dataId,
                } as ShiftDefinitionTemplateInputModel)
                .then(async (response) => {
                  //console.log(response);
                  if (!response.data.success) {
                    apiErrorStore.setApiErrorMessage(
                      response.data.failureMessage
                    );
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
const toggleGridTemplateOperationMenu = (event: any, id: number) => {
  gridTemplateOperationMenu.value.dataId = id;
  console.log(id);
  gridTemplateOperationMenu.value.toggle(event);
};

const shiftDefinitionTemplates = ref<ShiftDefinitionTemplateViewModel[]>();
const submitted = ref(false);
const jobs = ref<ResourceTypeViewModel[]>();
const state = reactive({
  job: ref<ResourceTypeViewModel>(),
});
const rules = {
  job: { required },
};
const v$ = useVuelidate(rules, state);
const jobService = ref(new ResourceTypeService());
const shiftDefinitionTemplateService = ref(
  new ShiftDefinitionTemplateService()
);
async function loadShiftDefinitionTemplates(
  searchParams?: ShiftDefinitionTemplateSearchModel
) {
  try {
    if (!searchParams) {
      searchParams = {
        pageSize: 2147483647, // Int32.MaxValue
        pageNo: 0,
        orderKey: "id",
        desc: true,
        resourceTypeId: 0,
        shiftId: props.shiftDefinitionId,
        isDeleted: false,
      } as ShiftDefinitionTemplateSearchModel;
    }

    const shiftDefinitionTemplatesResponse =
      await shiftDefinitionTemplateService.value.getShiftDefinitionTemplates(
        searchParams
      );

    shiftDefinitionTemplates.value = shiftDefinitionTemplatesResponse.data;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
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
    shiftDefinitionTemplateService.value
      .createShiftDefinitionTemplate({
        id: 0,
        shiftId: props.shiftDefinitionId,
        resourceTypeId: v$.value.job.$model!.id,
      } as ShiftDefinitionTemplateInputModel)
      .then(async (response) => {
        //console.log(response);
        if (!response.data.success) {
          apiErrorStore.setApiErrorMessage(response.data.failureMessage);
          return;
        }

        await loadShiftDefinitionTemplates();
        showSuccess(t("toast.success.create"));
        resetTemplateForm();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
const resetTemplateForm = () => {
  state.job = undefined;

  submitted.value = false;
};
const onDropdownJobFilter = async (event: any) => {
  try {
    jobs.value = (
      await jobService.value.getResourceTypes({
        pageNo: 0,
        pageSize: generalStore.dropdownItemsCount,
        orderKey: "id",
        id: 0,
        desc: true,
        resourceName: event.value,
      } as ResourceTypeSearchModel)
    ).data;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
};

const handleSearch = async () => {
  await loadShiftDefinitionTemplates(); // {
  // pageSize: pageSize.value,
  // pageNo: pageNumber.value,
  // orderKey: "id",
  // desc: true,
  // resourceTypeId: 0,
  // shiftId: props.shiftDefinitionId,
  // isDeleted: false,
  // } as ShiftDefinitionTemplateSearchModel
};

const loadEssentials = async () => {
  try {
    // jobs
    jobs.value = (
      await jobService.value.getResourceTypes({
        pageSize: generalStore.dropdownItemsCount,
        orderKey: "id",
        pageNo: 0,
        desc: true,
        id: 0,
        resourceName: "",
      } as ResourceTypeSearchModel)
    ).data;

    // shiftDefinitionTemplates
    await handleSearch();
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
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
                      @filter="onDropdownJobFilter"
                      ><template #empty>
                        {{ t("dropdown.slot.empty") }}
                      </template></Dropdown
                    >

                    <label
                      for="job"
                      :class="{
                        'p-error': v$.job.$invalid && submitted,
                      }"
                      >{{ t("shiftTabletCrew.jobName")
                      }}<span :style="{ color: 'var(--red-500)' }"
                        >*</span
                      ></label
                    >
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-2">
                  <Button
                    type="submit"
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
                field="resourceTypeName"
                :header="t('grid.header.jobName')"
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
                      toggleGridTemplateOperationMenu($event, slotProps.data.id)
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
</template>
<style lang="scss" scoped></style>