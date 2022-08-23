<script lang="ts" setup>
import RoleTypes from "@/enums/RoleType";
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";

const generalStore = useGeneralStore();

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);
const loading = ref(true);
const totalRecords = ref(0);

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

const shiftTabletCrews = ref<InstanceType<typeof ShiftTabletCrewViewModel>[]>();
const agent = ref<InstanceType<typeof AgentViewModel>>();
const job = ref<InstanceType<typeof JobViewModel>>();

const editingRows = ref<any[]>([]);

const rowClass = (rowData: any) => {
  if (!(rowData.entranceTime && rowData.exitTime)) {
    return "row-unattended";
  } else {
    return "row-attended";
  }
};

const crewReplacement = ref<InstanceType<typeof AgentViewModel>>();
const crewReplacements = ref<InstanceType<typeof AgentViewModel>[]>();
const entranceTime = ref("");
const exitTime = ref("");

const onRowEditInit = async (event: any) => {
  const { data, newData, index } = event;

  editingRows.value = [data];

  entranceTime.value = data.entranceTime
    ? data.entranceTime
    : data.defaultEntranceTime;

  exitTime.value = data.exitTime ? data.exitTime : data.defaultExitTime;

  crewReplacement.value = undefined;
  try {
    crewReplacements.value = (
      await agentService.value.getAll(
        new AgentSearchModel({
          pageSize: generalStore.dropdownItemsCount,
          orderKey: "id",
          desc: true,
          jobId: editingRows.value[0]?.jobId,
        })
      )
    ).data;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
};

const onRowEditSave = async (event: any) => {
  const { data, newData, index } = event;

  console.log(newData);

  if (!(entranceTime.value && exitTime.value)) {
    editingRows.value = [event.data];
    return;
  }

  await shiftTabletCrewService.value
    .update(
      new ShiftTabletCrewInputModel({
        id: data.id,
        entranceTime: entranceTime.value,
        exitTime: exitTime.value,
        agentId: crewReplacement.value
          ? crewReplacement.value.id
          : data.agentId,
        shiftTabletId: data.shiftTabletId,
        jobId: data.jobId,
        roleTypeId: RoleTypes.Secretary,
      })
    )
    .then((response) => {
      if (response.data.success == false) {
        apiErrorStore.setApiErrorMessage(response.data.message);
      } else {
        showSuccess(t("toast.success.update"));

        handleSearch();
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const onDropdownCrewReplacementFilter = async (event: any) => {
  try {
    crewReplacements.value = (
      await agentService.value.getAll(
        new AgentSearchModel({
          pageSize: generalStore.dropdownItemsCount,
          orderKey: "id",
          desc: true,
          name: event.value,
          jobId: editingRows.value[0]?.jobId,
        })
      )
    ).data;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
};

async function loadShiftTabletCrews(
  searchParams?: InstanceType<typeof ShiftTabletCrewSearchModel>
) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = new ShiftTabletCrewSearchModel({
        pageSize: pageSize.value,
        pageNo: pageNumber.value,
        orderKey: "id",
        desc: true,
      });
    }

    const shiftTabletCrewsResponse = await shiftTabletCrewService.value.getAll(
      searchParams
    );

    shiftTabletCrews.value = shiftTabletCrewsResponse.data;
    totalRecords.value = shiftTabletCrewsResponse.totalCount;

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

  await loadShiftTabletCrews(
    new ShiftTabletCrewSearchModel({
      shiftTabletId: +route.params.shiftTabletId,
      pageSize: pageSize.value,
      pageNo: pageNumber.value,
      orderKey: "id",
      desc: true,

      agentId: agent.value?.id ?? 0,
      jobId: job.value?.id ?? 0,
      roleTypeId: RoleTypes.Secretary,
    })
  );

  submitButtonIsLoading.value = false;
};

const shiftTabletCrewService = ref(new ShiftTabletCrewService());
const agentService = ref(new AgentService());

const loadEssentials = async () => {
  try {
    // shiftTabletCrews
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
  () => route.params.shiftTabletId,
  async (shiftTabletId, prevShiftTabletId) => {
    if (shiftTabletId) {
      await loadEssentials();
    }
  },
  { immediate: true }
);

// lifecycle hooks
// onMounted(async () => {
// });
</script>

<template>
  <div class="content-section">
    <div class="grid">
      <div class="col-12 md:col-12">
        <div class="card">
          <DataTable
            v-model:editing-rows="editingRows"
            :value="shiftTabletCrews"
            data-key="id"
            edit-mode="row"
            :loading="loading"
            show-gridlines
            striped-rows
            :row-hover="true"
            :row-class="rowClass"
            responsive-layout="scroll"
            @row-edit-save="onRowEditSave"
            @row-edit-init="onRowEditInit"
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
              field="agentFullName"
              :header="t('grid.header.agentFullName')"
            ></Column>
            <Column
              field="jobTitle"
              :header="t('grid.header.jobTitle')"
            ></Column>

            <Column field="" :header="t('grid.header.crewReplacement')">
              <template #editor>
                <Dropdown
                  v-model="crewReplacement"
                  :options="crewReplacements"
                  option-label="fullname"
                  :filter="true"
                  :show-clear="true"
                  @filter="onDropdownCrewReplacementFilter"
                  ><template #empty>
                    {{ t("dropdown.slot.empty") }}
                  </template></Dropdown
                >
              </template>
            </Column>
            <Column
              field="entranceTime"
              :header="t('grid.header.entranceTime')"
            >
              <template #editor>
                <PersianDatePicker
                  v-model="entranceTime"
                  type="time"
                  format="HH:mm:00"
                  display-format="HH:mm"
                  input-class="p-inputtext p-component"
                  :compact-time="true"
                  :clearable="true"
                  :auto-submit="true"
                  :popover="false"
                  :editable="true"
                />
              </template>
            </Column>
            <Column field="exitTime" :header="t('grid.header.exitTime')">
              <template #editor>
                <PersianDatePicker
                  v-model="exitTime"
                  type="time"
                  format="HH:mm:00"
                  display-format="HH:mm"
                  input-class="p-inputtext p-component"
                  :compact-time="true"
                  :clearable="true"
                  :auto-submit="true"
                  :popover="false"
                  :editable="true"
                />
              </template>
            </Column>

            <Column
              :row-editor="true"
              style="width: 10%; min-width: 8rem"
              body-style="text-align:center"
              :header="t('grid.button.operation')"
            ></Column>
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
          >
          </Paginator>
        </div>
      </div>
    </div>

    <Toast position="top-center" group="br" />
    <ConfirmDialog position="top-center"></ConfirmDialog>
  </div>
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

.info {
  background-color: var(--blue-50);
}
</style>

<style lang="scss">
.row-unattended {
  background-color: var(--yellow-100) !important;
}
.row-attended {
  background-color: var(--green-100) !important;
}
</style>
