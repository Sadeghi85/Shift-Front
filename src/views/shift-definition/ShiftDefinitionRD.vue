<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
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

const generalStore = useGeneralStore();

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);
const loading = ref(false);
const totalRecords = ref(0);

const cuShiftDefinitionId = ref(0);

const createUpdateFormIsVisible = ref(false);
const searchFormIsVisible = ref(false);

const openCreateUpdateForm = () => {
  createUpdateFormIsVisible.value = true;
};
const closeCreateUpdateForm = () => {
  cuShiftDefinitionId.value = 0;
  createUpdateFormIsVisible.value = false;
};
const toggleCreateUpdateForm = () => {
  cuShiftDefinitionId.value = 0;
  createUpdateFormIsVisible.value = !createUpdateFormIsVisible.value;
};
const openSearchForm = () => {
  searchFormIsVisible.value = true;
};
const closeSearchForm = () => {
  searchFormIsVisible.value = false;
};
const toggleSearchForm = () => {
  searchFormIsVisible.value = !searchFormIsVisible.value;
};

const gridOperationMenu = ref();
const gridOperationMenuItems = ref([
  {
    label: t("grid.button.operation"),
    items: [
      {
        label: t("menu.item.update"),
        icon: "pi pi-pencil",
        command: () => {
          closeSearchForm();
          cuShiftDefinitionId.value = gridOperationMenu.value.dataId;
          openCreateUpdateForm();
        },
      },
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
              shiftDefinitionService.value
                .deleteShiftDefinition({
                  id: gridOperationMenu.value.dataId,
                } as ShiftDefinitionInputModel)
                .then((response) => {
                  //console.log(response);
                  if (!response.data.success) {
                    apiErrorStore.setApiErrorMessage(
                      response.data.failureMessage
                    );
                    return;
                  }

                  handleSearch();
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

const toggleGridOperationMenu = (event: any, id: number) => {
  //cuShiftLocationId.value = id;
  gridOperationMenu.value.dataId = id;
  gridOperationMenu.value.toggle(event);
};

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
  gridTemplateOperationMenu.value.toggle(event);
};
const displayShiftDefinitionTemplateModal = ref(false);
const shiftDefinitionId = ref<number | null>(null);
const openShiftDefinitionTemplateModal = async (_shiftDefinitionId: number) => {
  shiftDefinitionId.value = _shiftDefinitionId;

  await loadShiftDefinitionTemplates();

  displayShiftDefinitionTemplateModal.value = true;
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
        shiftId: shiftDefinitionId.value,
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
        shiftId: shiftDefinitionId.value,
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

const shiftDefinitions = ref<ShiftDefinitionViewModel[]>();
const portals = ref<PortalViewModel[]>();
const shiftTypes = ref<ShiftTypeViewModel[]>([
  { id: 1, title: t("shift.type.regie") },
  { id: 2, title: t("shift.type.coordinator") },
]);

async function loadShiftDefinitions(searchParams?: ShiftDefinitionSearchModel) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = {
        pageSize: pageSize.value,
        pageNo: pageNumber.value,
        title: "",
        isDeleted: false,
      } as ShiftDefinitionSearchModel;
    }

    const shiftDefinitionsResponse =
      await shiftDefinitionService.value.getShiftDefinitions(searchParams);

    shiftDefinitions.value = shiftDefinitionsResponse.data;
    totalRecords.value = shiftDefinitionsResponse.totalCount;
    loading.value = false;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
}

const onPage = async (event: any) => {
  generalStore.rowPerPage = event.rows;

  pageSize.value = event.rows;
  pageNumber.value = event.page;
  await handleSearch();
};

const handleSearch = async () => {
  await loadShiftDefinitions({
    pageSize: pageSize.value,
    pageNo: pageNumber.value,
    portalId: portal.value?.id ?? 0,
    title: shiftTitle.value ?? "",
    shiftType: shiftType.value?.id ?? 0,
    orderKey: "id",
    desc: true,
    isDeleted: false,
  } as ShiftDefinitionSearchModel);
};
const shiftTitle = ref("");
const portal = ref<PortalViewModel>();
const shiftType = ref<ShiftTypeViewModel>();

const portalService = ref(new PortalService());
const shiftDefinitionService = ref(new ShiftDefinitionService());

const resetSearchForm = async () => {
  shiftTitle.value = "";
  portal.value = undefined;
  shiftType.value = undefined;

  searchFormIsVisible.value = false;

  await handleSearch();
};

const insertIsDone = async () => {
  await resetSearchForm();
  await handleSearch();
};

const updateIsDone = async () => {
  closeCreateUpdateForm();
  await handleSearch();
};

const loadEssentials = async () => {
  try {
    // portals
    portals.value = (
      await portalService.value.getPortals({
        pageSize: 2147483647, // Int32.MaxValue
        pageNo: 0,
        orderKey: "id",
        desc: true,
        portalId: 0,
        title: "",
      } as PortalSearchModel)
    ).data;

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

    // shiftDefinitions
    await handleSearch();
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
};

// lifecycle hooks
onMounted(async () => {
  await loadEssentials();
});
</script>

<template>
  <div class="layout-content">
    <div class="grid">
      <div class="col-12 md:col-12">
        <Toolbar>
          <template #end>
            <Button
              icon="pi pi-search"
              class="p-button-rounded ml-2"
              @click.prevent="
                closeCreateUpdateForm();
                toggleSearchForm();
              "
            />
            <Button
              icon="pi pi-plus"
              class="p-button-rounded p-button-success"
              @click.prevent="
                closeSearchForm();
                toggleCreateUpdateForm();
              "
            />
          </template>
        </Toolbar>
      </div>
    </div>

    <Transition>
      <div v-if="createUpdateFormIsVisible">
        <ShiftDefinitionCU
          :shift-definition-id="cuShiftDefinitionId"
          @insert-is-done="insertIsDone"
          @update-is-done="updateIsDone"
          @cu-is-canceled="closeCreateUpdateForm"
        >
        </ShiftDefinitionCU>
      </div>
    </Transition>

    <Transition>
      <div v-if="searchFormIsVisible" class="content-section">
        <div class="grid">
          <div class="col-12 md:col-12 p-fluid">
            <div class="card">
              <form
                class="p-fluid"
                autocomplete="off"
                @submit.prevent="handleSearch()"
              >
                <div class="grid formgrid">
                  <div class="col-12 mb-2 md:col-4">
                    <div class="p-float-label">
                      <InputText id="shiftTitle" v-model="shiftTitle" />
                      <label for="shiftTitle">{{ t("shift.title") }}</label>
                    </div>
                  </div>
                  <div class="field col-12 mb-2 md:col-4">
                    <div class="p-float-label">
                      <Dropdown
                        id="portal"
                        v-model="portal"
                        :options="portals"
                        option-label="title"
                        :filter="true"
                        :show-clear="true"
                      />

                      <label for="portal">{{ t("portal.name") }}</label>
                    </div>
                  </div>

                  <div class="field col-12 mb-2 md:col-4">
                    <div class="p-float-label">
                      <Dropdown
                        id="shiftType"
                        v-model="shiftType"
                        :options="shiftTypes"
                        option-label="title"
                        :show-clear="true"
                      />

                      <label for="shiftType">{{ t("shiftType.title") }}</label>
                    </div>
                  </div>
                </div>

                <div class="grid">
                  <div class="col-12 mb-2 md:col-1">
                    <Button
                      type="submit"
                      :label="t('button.search')"
                      class="mt-4"
                    />
                  </div>
                  <div class="col-12 mb-2 md:col-1">
                    <Button
                      type="button"
                      :label="t('button.cancel')"
                      class="mt-4 p-button-secondary"
                      @click.prevent="resetSearchForm"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12">
          <div class="card">
            <DataTable
              :value="shiftDefinitions"
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
                field="title"
                :header="t('grid.header.shiftTitle')"
              ></Column>
              <Column
                field="portalTitle"
                :header="t('grid.header.portal')"
              ></Column>
              <Column
                field="startTime"
                :header="t('grid.header.startTime')"
              ></Column>
              <Column
                field="endTime"
                :header="t('grid.header.endTime')"
              ></Column>
              <Column
                field="shiftTypeTitle"
                :header="t('grid.header.shiftTypeTitle')"
              ></Column>
              <Column
                header-style="width: 12em;"
                header-class="align-center"
                body-style="text-align: center;"
              >
                <template #header>
                  <span>{{ t("grid.button.shift-definition-template") }}</span>
                </template>
                <template #body="slotProps">
                  <Button
                    icon="pi pi-book"
                    class="p-button-rounded p-button-secondary"
                    @click.prevent="
                      openShiftDefinitionTemplateModal(slotProps.data.id)
                    "
                  ></Button>
                </template>
              </Column>
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
                      toggleGridOperationMenu($event, slotProps.data.id)
                    "
                  />
                </template>
              </Column>
            </DataTable>

            <Paginator
              v-model:rows="pageSize"
              :total-records="totalRecords"
              :rows-per-page-options="[10, 25, 50, 100]"
              template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              :current-page-report-template="
                t('grid.currentPageReportTemplate', [
                  '{currentPage}',
                  '{totalPages}',
                ])
              "
              @page="onPage($event)"
            ></Paginator>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Menu
    id="grid_operation_menu"
    ref="gridOperationMenu"
    :model="gridOperationMenuItems"
    :popup="true"
  />

  <Menu
    id="grid_template_operation_menu"
    ref="gridTemplateOperationMenu"
    :model="gridTemplateOperationMenuItems"
    :popup="true"
  />

  <Dialog
    v-model:visible="displayShiftDefinitionTemplateModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '75vw' }"
    :modal="true"
    :closable="true"
  >
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
                    />

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

                <div class="field col-12 mb-4 md:col-4">
                  <Button
                    type="submit"
                    :label="t('button.create')"
                    class="mt-4 p-button-primary"
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
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </Dialog>

  <Toast position="top-center" group="br" />
  <ConfirmDialog position="top-center"></ConfirmDialog>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
