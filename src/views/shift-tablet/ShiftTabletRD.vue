<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import useApiErrorStore from "@/stores/api-error";
import ShiftTabletService from "@/services/ShiftTabletService";
import { useToast } from "primevue/usetoast";
import {
  ShiftTabletViewModel,
  ShiftTabletInputModel,
  ShiftTabletSearchModel,
} from "@/models/ShiftTabletModels";
import {
  ShiftDefinitionViewModel,
  ShiftDefinitionSearchModel,
  ShiftDefinitionInputModel,
} from "@/models/ShiftDefinitionModels";
import ShiftDefinitionService from "@/services/ShiftDefinitionService";

import ShiftTabletCU from "@/views/shift-tablet/ShiftTabletCU.vue";
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from "vue-router";
import ShiftTabletCrewService from "@/services/ShiftTabletCrewService";
import { ShiftTabletCrewSearchModel } from "@/models/ShiftTabletCrewModels";
import { useGeneralStore } from "@/stores/general";
import { pdate } from "@/helpers/utilities";

const generalStore = useGeneralStore();

const router = useRouter();

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const apiErrorStore = useApiErrorStore();

const shiftTabletCrewService = ref(new ShiftTabletCrewService());
const shiftTabletService = ref(new ShiftTabletService());
const shiftDefinitionService = ref(new ShiftDefinitionService());

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);

const loading = ref(false);
const totalRecords = ref(0);

const cuShiftTabletId = ref(0);

const createUpdateFormIsVisible = ref(false);
const searchFormIsVisible = ref(false);

const openCreateUpdateForm = () => {
  createUpdateFormIsVisible.value = true;
};
const closeCreateUpdateForm = () => {
  cuShiftTabletId.value = 0;
  createUpdateFormIsVisible.value = false;
};
const toggleCreateUpdateForm = () => {
  cuShiftTabletId.value = 0;
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

const getShiftTabletReportPdf = () => {
  shiftTabletCrewService.value
    .getShiftTabletCrewPdf({
      pageNo: 0,
      pageSize: 2147483647, // Int32.MaxValue
      orderKey: "",
      desc: true,
      shifTabletId: 0,
      agentId: 0,
      agentName: "",
      entranceTime: "",
      exitTime: "",
      fromDate: shiftTabletFromDate.value ?? "",
      toDate: shiftTabletToDate.value ?? "",
      shiftTitle: "",
      isReplaced: null,
      id: 0,
      isDeleted: false,
      title: "",
      resourceTypeId: 0,
    } as ShiftTabletCrewSearchModel)
    .then((response) => {
      //console.log(response);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "ShiftTabletCrew.pdf");
      link.click();
      URL.revokeObjectURL(link.href);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getShiftTabletReportExcel = () => {
  shiftTabletCrewService.value
    .getShiftTabletCrewExcel({
      pageNo: 0,
      pageSize: 2147483647, // Int32.MaxValue
      orderKey: "",
      desc: true,
      shifTabletId: 0,
      agentId: 0,
      agentName: "",
      entranceTime: "",
      exitTime: "",
      fromDate: shiftTabletFromDate.value ?? "",
      toDate: shiftTabletToDate.value ?? "",
      shiftTitle: "",
      isReplaced: null,
      id: 0,
      isDeleted: false,
      title: "",
      resourceTypeId: 0,
    } as ShiftTabletCrewSearchModel)
    .then((response) => {
      //console.log(response);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "ShiftTabletCrew.xlsx");
      link.click();
      URL.revokeObjectURL(link.href);
    })
    .catch((error) => {
      console.log(error);
    });
};

const shiftTabletReportMenu = ref();
const shiftTabletReportMenuItems = ref([
  {
    label: t("menu.item.reports"),
    items: [
      {
        label: t("menu.item.excel"),
        icon: "pi pi-file-excel",
        command: () => {
          getShiftTabletReportExcel();
        },
      },
      {
        label: t("menu.item.pdf"),
        icon: "pi pi-file-pdf",
        command: () => {
          getShiftTabletReportPdf();
        },
      },
    ],
  },
]);

const toggleShiftTabletReportMenu = (event: any) => {
  shiftTabletReportMenu.value.toggle(event);
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
          cuShiftTabletId.value = gridOperationMenu.value.dataId;
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
              shiftTabletService.value
                .deleteShiftTablet({
                  id: gridOperationMenu.value.dataId,
                } as ShiftTabletInputModel)
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

const shiftDefinition = ref<ShiftDefinitionViewModel>();
const shiftTabletFromDate = ref("");
const shiftTabletToDate = ref("");

const shiftTablets = ref<ShiftTabletViewModel[]>();
const shiftDefinitions = ref<ShiftDefinitionViewModel[]>();

async function loadShiftTablets(searchParams?: ShiftTabletSearchModel) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = {
        pageNo: pageNumber.value,
        pageSize: pageSize.value,
        orderKey: "id",
        desc: true,
        shiftId: 0,
        shiftDate: "",
        id: 0,
        fromDate: "",
        toDate: "",
        isDeleted: false,
      } as ShiftTabletSearchModel;
    }

    const shiftTabletResponse = await shiftTabletService.value.getShiftTablets(
      searchParams
    );

    shiftTablets.value = shiftTabletResponse.data;
    totalRecords.value = shiftTabletResponse.totalCount;
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
  await loadShiftTablets({
    pageSize: pageSize.value,
    pageNo: pageNumber.value,

    shiftId: shiftDefinition.value?.id ?? 0,
    fromDate: shiftTabletFromDate.value ?? "",
    toDate: shiftTabletToDate.value ?? "",

    orderKey: "id",
    desc: true,
    isDeleted: false,
  } as ShiftTabletSearchModel);
};

const resetSearchForm = async () => {
  shiftDefinition.value = undefined;
  shiftTabletFromDate.value = "";
  shiftTabletToDate.value = "";

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
    // shiftDefinitions
    shiftDefinitions.value = (
      await shiftDefinitionService.value.getShiftDefinitions({
        pageSize: 2147483647, // Int32.MaxValue
        pageNo: 0,
        title: "",
        orderKey: "id",
        desc: true,
        id: 0,
        portalId: 0,
        shiftType: 0,
        isDeleted: false,
      } as ShiftDefinitionSearchModel)
    ).data;

    // shiftTablets
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
        <ShiftTabletCU
          :shift-tablet-id="cuShiftTabletId"
          @insert-is-done="insertIsDone"
          @update-is-done="updateIsDone"
          @cu-is-canceled="closeCreateUpdateForm"
        >
        </ShiftTabletCU>
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
                  <div class="field col-12 mb-4 md:col-4">
                    <div class="p-float-label">
                      <Dropdown
                        id="shiftDefinition"
                        v-model="shiftDefinition"
                        :options="shiftDefinitions"
                        option-label="title"
                        :show-clear="true"
                      />

                      <label for="shiftDefinition">{{
                        t("shiftDefinition.title")
                      }}</label>
                    </div>
                  </div>

                  <div class="field col-12 mb-4 md:col-4">
                    <div class="p-float-label">
                      <PersianDatePicker
                        v-model="shiftTabletFromDate"
                        :placeholder="t('input.fromDate')"
                        type="date"
                        format="YYYY-MM-DD"
                        display-format="jYYYY/jMM/jDD"
                        input-class="p-inputtext p-component"
                        :clearable="true"
                        :auto-submit="true"
                        :popover="true"
                      />
                    </div>
                  </div>

                  <div class="field col-12 mb-4 md:col-4">
                    <div class="p-float-label">
                      <PersianDatePicker
                        v-model="shiftTabletToDate"
                        :placeholder="t('input.toDate')"
                        type="date"
                        format="YYYY-MM-DD"
                        display-format="jYYYY/jMM/jDD"
                        input-class="p-inputtext p-component"
                        :clearable="true"
                        :auto-submit="true"
                        :popover="true"
                      />
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

                  <div class="col-12 mb-2 md:col-2">
                    <Button
                      type="button"
                      class="mt-4 p-button-help"
                      :label="t('button.shiftTablet.report')"
                      @click.prevent="toggleShiftTabletReportMenu($event)"
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
              :value="shiftTablets"
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
                field="portalName"
                :header="t('grid.header.portal')"
              ></Column>
              <Column
                field="shiftTitle"
                :header="t('grid.header.shiftTitle')"
              ></Column>
              <Column field="shiftDate" :header="t('grid.header.shiftDate')">
                <template #body="slotProps">
                  {{ pdate(slotProps.data.shiftDate) }}
                </template>
              </Column>
              <Column
                field="shiftWorthPercent"
                :header="t('grid.header.shiftWorthPercent')"
              ></Column>
              <Column
                header-style="width: 12em;"
                header-class="align-center"
                body-style="text-align: center;"
              >
                <template #header>
                  <span>{{
                    t("grid.button.shift-tablet-crew-secretary")
                  }}</span>
                </template>
                <template #body="slotProps">
                  <Button
                    icon="pi pi-list"
                    class="p-button-rounded p-button-secondary"
                    @click.prevent="
                      router.push({
                        name: 'shift-tablet-crew-secretary',
                        params: { shiftTabletId: slotProps.data.id },
                      })
                    "
                  ></Button>
                </template>
              </Column>
              <Column
                header-style="width: 12em;"
                header-class="align-center"
                body-style="text-align: center;"
              >
                <template #header>
                  <span>{{
                    t("grid.button.shift-tablet-crew-assignment")
                  }}</span>
                </template>
                <template #body="slotProps">
                  <Button
                    icon="pi pi-users"
                    class="p-button-rounded p-button-secondary"
                    @click.prevent="
                      router.push({
                        name: 'shift-tablet-crew',
                        params: { shiftTabletId: slotProps.data.id },
                      })
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
    id="shift_tablet_report_menu"
    ref="shiftTabletReportMenu"
    :model="shiftTabletReportMenuItems"
    :popup="true"
  />

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
