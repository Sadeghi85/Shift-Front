<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";
import { useUserStore } from "@/stores/user";

import { pdate } from "@/helpers/utilities";
import { useGridFiltersStore } from "@/stores/gridFilters";

const generalStore = useGeneralStore();
const userStore = useUserStore();
const gridFiltersStore = useGridFiltersStore();

const router = useRouter();

const { can, cannot } = useAbility();

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const confirmGroup = uuidv4();

const apiErrorStore = useApiErrorStore();

const shiftTabletCrewService = ref(new ShiftTabletCrewService());
const shiftTabletService = ref(new ShiftTabletService());
const shiftDefinitionService = ref(new ShiftDefinitionService());

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);

const loading = ref(true);
const totalRecords = ref(0);

const submitButtonIsLoading = ref(false);

const blockedDocument = ref(false);

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
  blockedDocument.value = true;

  shiftTabletService.value
    .getPdf(
      new ShiftTabletSearchModel({
        pageNo: 0,
        pageSize: 2147483647, // Int32.MaxValue
        orderKey: "id",
        desc: true,
        portalId: portal.value?.id,
        shiftId: shiftDefinition.value?.id,
        fromDate: shiftTabletDateRange.value
          ? shiftTabletDateRange.value[0]
          : "",
        toDate: shiftTabletDateRange.value ? shiftTabletDateRange.value[1] : "",
        //fromDate: shiftTabletFromDate.value ?? "",
        //toDate: shiftTabletToDate.value ?? "",
      })
    )
    .then((response) => {
      blockedDocument.value = false;
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
      blockedDocument.value = false;

      console.log(error);
    });
};

const getShiftTabletReportExcel = () => {
  blockedDocument.value = true;

  shiftTabletService.value
    .getExcel(
      new ShiftTabletSearchModel({
        pageNo: 0,
        pageSize: 2147483647, // Int32.MaxValue
        orderKey: "id",
        desc: true,
        portalId: portal.value?.id,
        shiftId: shiftDefinition.value?.id,
        fromDate: shiftTabletDateRange.value
          ? shiftTabletDateRange.value[0]
          : "",
        toDate: shiftTabletDateRange.value ? shiftTabletDateRange.value[1] : "",
        //fromDate: shiftTabletFromDate.value ?? "",
        //toDate: shiftTabletToDate.value ?? "",
      })
    )
    .then((response) => {
      blockedDocument.value = false;
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
      blockedDocument.value = false;

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
          cuShiftTabletId.value = gridOperationMenu.value.data.id;
          openCreateUpdateForm();
        },
      },
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
              shiftTabletService.value
                .delete(gridOperationMenu.value.data.id)
                .then((response) => {
                  //console.log(response);
                  if (!response.data.success) {
                    apiErrorStore.setApiErrorMessage(response.data.message);
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

const toggleGridOperationMenu = (event: any, data: any) => {
  //cuShiftLocationId.value = id;
  gridOperationMenu.value.data = data;
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

const portals = ref<InstanceType<typeof PortalViewModel>[]>();
const portal = ref<InstanceType<typeof PortalViewModel>>();
const portalService = ref(new PortalService());

const shiftDefinition = ref<InstanceType<typeof ShiftDefinitionViewModel>>();
//const shiftTabletFromDate = ref("");
//const shiftTabletToDate = ref("");
const shiftTabletDateRange = ref<string[]>(
  gridFiltersStore.shiftTabletGridFilter.dateRange
);

const shiftTablets = ref<InstanceType<typeof ShiftTabletViewModel>[]>();
const shiftDefinitions = ref<InstanceType<typeof ShiftDefinitionViewModel>[]>();

async function loadShiftTablets(
  searchParams?: InstanceType<typeof ShiftTabletSearchModel>
) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = new ShiftTabletSearchModel({
        pageNo: pageNumber.value,
        pageSize: pageSize.value,
        orderKey: "id",
        desc: true,
        isDeleted: false,
      });
    }

    const shiftTabletResponse = await shiftTabletService.value.getAll(
      searchParams
    );

    shiftTablets.value = shiftTabletResponse.data;
    totalRecords.value = shiftTabletResponse.totalCount;

    loading.value = false;
  } catch (error: any) {
    loading.value = false;

    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
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
  submitButtonIsLoading.value = true;

  gridFiltersStore.setShiftTabletGridFilter({
    dateRange: shiftTabletDateRange.value,
  });

  await loadShiftTablets(
    new ShiftTabletSearchModel({
      pageSize: pageSize.value,
      pageNo: pageNumber.value,

      portalId: portal.value?.id ?? 0,
      shiftId: shiftDefinition.value?.id ?? 0,
      //fromDate: shiftTabletFromDate.value ?? "",
      //toDate: shiftTabletToDate.value ?? "",
      fromDate: shiftTabletDateRange.value ? shiftTabletDateRange.value[0] : "",
      toDate: shiftTabletDateRange.value ? shiftTabletDateRange.value[1] : "",

      orderKey: "id",
      desc: true,
      isDeleted: false,
    })
  );

  submitButtonIsLoading.value = false;
};

const resetSearchForm = async () => {
  portal.value = undefined;
  if (portals.value?.length == 1) {
    portal.value = portals.value[0];
  }

  shiftDefinition.value = undefined;
  //shiftTabletFromDate.value = "";
  //shiftTabletToDate.value = "";
  shiftTabletDateRange.value = [];

  gridFiltersStore.setShiftTabletGridFilter({
    dateRange: shiftTabletDateRange.value,
  });

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

const onDropDownPortalChange = async (event: any) => {
  try {
    shiftDefinition.value = undefined;
    shiftDefinitions.value = undefined;
    shiftDefinitions.value = (
      await shiftDefinitionService.value.getAll(
        new ShiftDefinitionSearchModel({
          portalId: event.value.id,
        })
      )
    ).data;

    if (shiftDefinitions.value.length == 1) {
      shiftDefinition.value = shiftDefinitions.value[0];
    }
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
};

const shiftTabletReportIcon = computed(() => {
  return shiftTabletReportMenu.value?.overlayVisible
    ? "pi-chevron-up"
    : "pi-chevron-down";
});

const loadEssentials = async () => {
  try {
    // portals
    portals.value = (
      await portalService.value.getAll(new PortalSearchModel({}))
    ).data;

    if (portals.value.length == 1) {
      portal.value = portals.value[0];
    }

    // shiftDefinitions
    // shiftDefinitions.value = (
    //   await shiftDefinitionService.value.getAll(
    //     new ShiftDefinitionSearchModel({})
    //   )
    // ).data;

    // shiftTablets
    await handleSearch();
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
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
                  <div
                    v-show="(userStore.user?.portalId ?? 2147483647) == 1"
                    class="field col-12 mb-4 md:col-3"
                  >
                    <div class="p-float-label">
                      <Dropdown
                        id="portal"
                        v-model="portal"
                        :options="portals"
                        option-label="title"
                        :filter="true"
                        :show-clear="true"
                        @change="onDropDownPortalChange"
                        ><template #empty>
                          {{ t("dropdown.slot.empty") }}
                        </template></Dropdown
                      >

                      <label for="portal">{{ t("portal.title") }}</label>
                    </div>
                  </div>

                  <div class="field col-12 mb-4 md:col-3">
                    <div class="p-float-label">
                      <Dropdown
                        id="shiftDefinition"
                        v-model="shiftDefinition"
                        :options="shiftDefinitions"
                        option-label="title"
                        :filter="true"
                        :show-clear="true"
                        ><template #empty>
                          {{ t("dropdown.slot.empty") }}
                        </template></Dropdown
                      >

                      <label for="shiftDefinition">{{
                        t("shiftDefinition.title")
                      }}</label>
                    </div>
                  </div>

                  <div class="field col-12 mb-4 md:col-3">
                    <div class="p-float-label">
                      <PersianDatePicker
                        v-model="shiftTabletDateRange"
                        :placeholder="t('input.dateRange')"
                        type="date"
                        format="YYYY-MM-DD"
                        display-format="jYYYY/jMM/jDD"
                        input-class="p-inputtext p-component"
                        :range="true"
                        :clearable="true"
                        :auto-submit="true"
                        :popover="true"
                      />
                    </div>
                  </div>
                </div>

                <div class="grid align-center">
                  <div class="col-12 mb-2 md:col-1">
                    <Button
                      type="submit"
                      :loading="submitButtonIsLoading"
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
                      :icon="'pi ' + shiftTabletReportIcon"
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
                field="portalTitle"
                :header="t('grid.header.portal')"
                :hidden="(userStore.user?.portalId ?? 2147483647) > 1"
              ></Column>
              <Column
                field="shiftTitle"
                :header="t('grid.header.shiftTitle')"
              ></Column>
              <Column field="shiftDate" :header="t('grid.header.shiftDate')">
                <template #body="slotProps">
                  {{ pdate(slotProps.data.shiftDate, "dddd، jYYYY/jMM/jDD") }}
                </template>
              </Column>
              <Column
                header-style="width: 12em;"
                header-class="align-center"
                body-style="text-align: center;"
                :hidden="cannot('shift-tablet-pakhsh-overseer-report', 'all')"
              >
                <template #header>
                  <span>{{
                    t("grid.button.shift-tablet-pakhsh-overseer-report")
                  }}</span>
                </template>
                <template #body="slotProps">
                  <Button
                    icon="pi pi-list"
                    class="p-button-rounded p-button-secondary"
                    @click.prevent="
                      router.push({
                        name: 'shift-tablet-pakhsh-overseer-report',
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
                :hidden="cannot('shift-tablet-secretary-report', 'all')"
              >
                <template #header>
                  <span>{{
                    t("grid.button.shift-tablet-secretary-report")
                  }}</span>
                </template>
                <template #body="slotProps">
                  <Button
                    icon="pi pi-list"
                    class="p-button-rounded p-button-secondary"
                    @click.prevent="
                      router.push({
                        name: 'shift-tablet-secretary-report',
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
                :hidden="cannot('shift-tablet-crew', 'all')"
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
                      toggleGridOperationMenu($event, slotProps.data)
                    "
                  />
                </template>
              </Column>
              <template #empty>
                {{ t("grid.slot.empty") }}
              </template>
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
  <ConfirmDialog position="top-center" :group="confirmGroup"></ConfirmDialog>

  <BlockUI :blocked="blockedDocument" :fullScreen="true"></BlockUI>
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
