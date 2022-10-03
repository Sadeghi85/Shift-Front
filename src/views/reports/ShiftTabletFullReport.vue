<script lang="ts" setup>
import jMoment from "moment-jalaali";
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";
import {
  ShiftTabletFullReportInputModel,
  ShiftTabletFullReportViewModel,
} from "@/models/ReportModel";

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const confirmGroup = uuidv4();

const apiErrorStore = useApiErrorStore();
const generalStore = useGeneralStore();

const loading = ref(false);
const searchButtonIsLoading = ref(false);

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);
const totalRecords = ref(0);

const blockedDocument = ref(false);

const stateSearch = reactive({
  portal: ref<InstanceType<typeof PortalViewModel>>(),
  shiftType: ref<InstanceType<typeof ShiftTypeViewModel>>(),
  datePersian: ref(""),
});
const rulesSearch = {
  portal: { required },
  shiftType: { required },
  datePersian: { required },
};
const v$Search = useVuelidate(rulesSearch, stateSearch);

const portals = ref<InstanceType<typeof PortalViewModel>[]>();
const portalService = ref(new PortalService());

const shiftTypes = ref<InstanceType<typeof ShiftTypeViewModel>[]>([
  //   { id: 0, title: t("shift.type.all") },
  { id: 1, title: t("shift.type.regie") },
  { id: 2, title: t("shift.type.coordinator") },
]);

const shiftTabletFullReports =
  ref<InstanceType<typeof ShiftTabletFullReportViewModel>[]>();
const reportService = ref(new ReportService());

const shiftTabletService = ref(new ShiftTabletService());

const getShiftTabletReportPdf = () => {
  blockedDocument.value = true;

  shiftTabletService.value
    .getPdf(
      new ShiftTabletSearchModel({
        pageNo: 0,
        pageSize: 2147483647, // Int32.MaxValue
        orderKey: "id",
        desc: true,
        portalId: gridOperationMenu.value.data.portalId,
        fromDate: gridOperationMenu.value.data.fromDate,
        toDate: gridOperationMenu.value.data.toDate,
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
        portalId: gridOperationMenu.value.data.portalId,
        fromDate: gridOperationMenu.value.data.fromDate,
        toDate: gridOperationMenu.value.data.toDate,
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

const gridOperationMenu = ref();
const gridOperationMenuItems = ref([
  {
    label: t("grid.button.operation"),
    items: [
      {
        label: t("menu.item.shift-tablet-excel"),
        icon: "pi pi-file-excel",
        command: () => {
          getShiftTabletReportExcel();
        },
      },
      {
        label: t("menu.item.shift-tablet-pdf"),
        icon: "pi pi-file-pdf",
        command: () => {
          getShiftTabletReportPdf();
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

async function loadShiftTabletFullReport() {
  try {
    loading.value = true;

    if (v$Search.value.$invalid) {
      loading.value = false;
      return;
    }

    const shiftTabletFullReportResponse =
      await reportService.value.getShiftTabletFullReport(
        new ShiftTabletFullReportInputModel({
          datePersian: v$Search.value.datePersian.$model,
          portalId: v$Search.value.portal.$model?.id,
          shiftTypeId: v$Search.value.shiftType.$model?.id,
        })
      );
    shiftTabletFullReports.value = shiftTabletFullReportResponse.data;
    totalRecords.value = shiftTabletFullReportResponse.totalCount;

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

const handleSearch = async () => {
  searchButtonIsLoading.value = true;

  if (v$Search.value.$invalid) {
    searchButtonIsLoading.value = false;
    return;
  }

  await loadShiftTabletFullReport();

  searchButtonIsLoading.value = false;
};

const loadEssentials = async () => {
  try {
    // portals
    portals.value = (
      await portalService.value.getAll(new PortalSearchModel({}))
    ).data;

    if (portals.value.length > 0) {
      v$Search.value.portal.$model = portals.value[0];
    }

    v$Search.value.shiftType.$model = shiftTypes.value[0];
    v$Search.value.datePersian.$model = jMoment().format("jYYYY/jMM/01");

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
    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card">
            <form
              class="p-fluid"
              autocomplete="off"
              @submit.prevent="handleSearch()"
            >
              <div class="grid formgrid">
                <div class="field col-12 mb-4 md:col-3">
                  <div class="p-float-label">
                    <Dropdown
                      id="portal"
                      v-model="v$Search.portal.$model"
                      :options="portals"
                      option-label="title"
                      :filter="true"
                      :show-clear="true"
                      :class="{ 'p-invalid': v$Search.portal.$invalid }"
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
                      id="shiftType"
                      v-model="v$Search.shiftType.$model"
                      :options="shiftTypes"
                      option-label="title"
                      :show-clear="true"
                      :class="{
                        'p-invalid': v$Search.shiftType.$invalid,
                      }"
                      ><template #empty>
                        {{ t("dropdown.slot.empty") }}
                      </template></Dropdown
                    >

                    <label for="shiftType">{{ t("shiftType.title") }}</label>
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-3">
                  <div class="p-float-label">
                    <PersianDatePicker
                      v-model="v$Search.datePersian.$model"
                      :input-class="
                        v$Search.datePersian.$invalid
                          ? 'p-inputtext p-component p-invalid'
                          : 'p-inputtext p-component '
                      "
                      format="jYYYY/jMM/01"
                      display-format="jYYYY"
                      type="year"
                      :clearable="true"
                      :auto-submit="true"
                      :popover="true"
                    />
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-2">
                  <Button
                    type="submit"
                    :label="t('button.search')"
                    :loading="searchButtonIsLoading"
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
        <div class="col-12 md:col-12 p-fluid">
          <div class="card">
            <DataTable
              :value="shiftTabletFullReports"
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

              <Column field="month" :header="t('grid.header.month')"></Column>
              <Column
                field="shiftTabletTotalCount"
                :header="t('grid.header.shiftTabletTotalCount')"
              ></Column>
              <Column
                field="shiftTabletRegisteredCount"
                :header="t('grid.header.shiftTabletRegisteredCount')"
              ></Column>
              <Column
                field="shiftTabletUnRegisteredCount"
                :header="t('grid.header.shiftTabletUnRegisteredCount')"
              ></Column>
              <Column
                field="shiftTabletRegisteredCrewCount"
                :header="t('grid.header.shiftTabletRegisteredCrewCount')"
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
                  <span
                    v-if="slotProps.data.shiftTabletRegisteredCrewCount > 0"
                  >
                    <Button
                      type="button"
                      class="p-button-rounded p-button-secondary"
                      icon="pi pi-cog"
                      @click.prevent="
                        toggleGridOperationMenu($event, slotProps.data)
                      "
                  /></span>
                </template>
              </Column>
              <template #empty>
                {{ t("grid.slot.empty") }}
              </template>
            </DataTable>

            <!-- <Paginator
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
            ></Paginator> -->
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

  <BlockUI :blocked="blockedDocument" :fullScreen="true"></BlockUI>
</template>

<style lang="scss" scoped></style>
