<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";
import { pdate } from "@/helpers/utilities";

const generalStore = useGeneralStore();

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);
const loading = ref(true);
const totalRecords = ref(0);

const submitButtonIsLoading = ref(false);

const searchFormIsVisible = ref(false);

const openSearchForm = () => {
  searchFormIsVisible.value = true;
};
const closeSearchForm = () => {
  searchFormIsVisible.value = false;
};
const toggleSearchForm = () => {
  searchFormIsVisible.value = !searchFormIsVisible.value;
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

const shiftTabletCrews = ref<InstanceType<typeof ShiftTabletCrewViewModel>[]>();
const jobs = ref<InstanceType<typeof JobViewModel>[]>();
const agents = ref<InstanceType<typeof AgentViewModel>[]>();
const agent = ref<InstanceType<typeof AgentViewModel>>();
const job = ref<InstanceType<typeof JobViewModel>>();
const shiftTablet = ref<InstanceType<typeof ShiftTabletViewModel>>();

const editingRows = ref<any[]>([]);

const rowClass = (rowData: any) => {
  if (!(rowData.entranceTime && rowData.exitTime)) {
    return "row-secretary-unattended";
  } else {
    return "row-secretary-attended";
  }
};

const entranceTime = ref("");
const exitTime = ref("");

const onRowEditCancel = (event: any) => {
  entranceTime.value = "";
  exitTime.value = "";
};

const onRowEditInit = (event: any) => {
  const { data, newData, index } = event;

  entranceTime.value = data["entranceTime"]
    ? data["entranceTime"]
    : data["defaultEntranceTime"];

  exitTime.value = data["exitTime"]
    ? data["exitTime"]
    : data["defaultExitTime"];
};

const onRowEditSave = (event: any) => {
  const { data, newData, index } = event;

  console.log(newData);

  if (!(entranceTime.value && exitTime.value)) {
    editingRows.value = [...editingRows.value, event.data];
    return;
  }

  shiftTabletCrewService.value
    .update(
      new ShiftTabletCrewInputModel({
        id: data.id,
        entranceTime: entranceTime.value,
        exitTime: exitTime.value,
        agentId: data.agentId,
        shiftTabletId: data.shiftTabletId,
        jobId: data.jobId,
      })
    )
    .then((response) => {
      if (response.data.success == false) {
        apiErrorStore.setApiErrorMessage(response.data.failureMessage);
      } else {
        handleSearch();
      }
    })
    .catch((error) => {
      console.log(error.message);
    });

  entranceTime.value = "";
  exitTime.value = "";
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
  submitButtonIsLoading.value = true;

  await loadShiftTabletCrews(
    new ShiftTabletCrewSearchModel({
      shifTabletId: +route.params.shiftTabletId,
      pageSize: pageSize.value,
      pageNo: pageNumber.value,
      orderKey: "id",
      desc: true,

      agentId: agent.value?.id ?? 0,
      jobId: job.value?.id ?? 0,
    })
  );

  submitButtonIsLoading.value = false;
};

const shiftTabletService = ref(new ShiftTabletService());
const shiftTabletCrewService = ref(new ShiftTabletCrewService());
const agentService = ref(new AgentService());
const jobService = ref(new JobService());

const resetSearchForm = async () => {
  agent.value = undefined;
  job.value = undefined;

  searchFormIsVisible.value = false;

  await handleSearch();
};

const onDropdownAgentFilter = async (event: any) => {
  try {
    agents.value = (
      await agentService.value.getAll(
        new AgentSearchModel({
          pageSize: generalStore.dropdownItemsCount,
          orderKey: "id",
          desc: true,
          name: event.value,
        })
      )
    ).data;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
};

const onDropdownJobFilter = async (event: any) => {
  try {
    jobs.value = (
      await jobService.value.getAll(
        new JobSearchModel({
          pageSize: generalStore.dropdownItemsCount,
          orderKey: "id",
          desc: true,
          title: event.value,
        })
      )
    ).data;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
};

const loadEssentials = async () => {
  try {
    // shiftTablet
    shiftTablet.value = (
      await shiftTabletService.value.getAll(
        new ShiftTabletSearchModel({
          id: +route.params.shiftTabletId,
          orderKey: "id",
          desc: true,
        })
      )
    ).data[0];

    // agents
    agents.value = (
      await agentService.value.getAll(
        new AgentSearchModel({
          pageSize: generalStore.dropdownItemsCount,
          orderKey: "id",
          desc: true,
        })
      )
    ).data;

    // jobs
    jobs.value = (
      await jobService.value.getAll(
        new JobSearchModel({
          pageSize: generalStore.dropdownItemsCount,
          orderKey: "id",
          desc: true,
        })
      )
    ).data;

    // shiftTabletCrews
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
  <div class="layout-content">
    <div class="grid">
      <div class="col-12 md:col-12">
        <Toolbar>
          <template #end>
            <Button
              icon="pi pi-search"
              class="p-button-rounded ml-2"
              @click.prevent="toggleSearchForm()"
            />

            <Button
              icon="pi pi-arrow-left"
              class="p-button-rounded p-button-warning"
              @click.prevent="
                router.options.history.state.back
                  ? router.back()
                  : router.push({ name: 'shift-tablet' })
              "
            />
          </template>
        </Toolbar>
      </div>
    </div>

    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card info">
            <div class="grid">
              <div class="col">
                {{ t("portal.title") }}:
                <strong>{{ shiftTablet?.portalTitle }}</strong>
              </div>
              <div class="col">
                {{ t("shift.title") }}:
                <strong>{{ shiftTablet?.shiftTitle }}</strong>
              </div>
              <div class="col">
                {{ t("shift.shiftDate") }}:
                <strong>{{
                  pdate(shiftTablet?.shiftDate ?? "", "dddd، jYYYY/jMM/jDD")
                }}</strong>
              </div>
              <div class="col">
                {{ t("shift.startTime") }}:
                <strong>{{ shiftTablet?.shiftStartTime }}</strong>
              </div>
              <div class="col">
                {{ t("shift.endTime") }}:
                <strong>{{ shiftTablet?.shiftEndTime }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
                  <div class="field col-12 mb-2 md:col-4">
                    <div class="p-float-label">
                      <Dropdown
                        id="agent"
                        v-model="agent"
                        :options="agents"
                        option-label="fullname"
                        :filter="true"
                        @filter="onDropdownAgentFilter"
                        ><template #empty>
                          {{ t("dropdown.slot.empty") }}
                        </template></Dropdown
                      >

                      <label for="agent">{{
                        t("shiftTabletCrew.agentFullname")
                      }}</label>
                    </div>
                  </div>
                  <div class="field col-12 mb-2 md:col-4">
                    <div class="p-float-label">
                      <Dropdown
                        id="job"
                        v-model="job"
                        :options="jobs"
                        option-label="title"
                        :filter="true"
                        @filter="onDropdownJobFilter"
                        ><template #empty>
                          {{ t("dropdown.slot.empty") }}
                        </template></Dropdown
                      >

                      <label for="job">{{
                        t("shiftTabletCrew.jobTitle")
                      }}</label>
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
              @row-edit-cancel="onRowEditCancel"
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
    </div>
  </div>

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

.info {
  background-color: var(--blue-50);
}
</style>

<style lang="scss">
.row-secretary-unattended {
  background-color: var(--yellow-100) !important;
}
.row-secretary-attended {
  background-color: var(--green-100) !important;
}
</style>
