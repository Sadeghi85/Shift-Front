<script lang="ts" setup>
import {
  reactive,
  ref,
  onMounted,
  watch,
  computed,
  defineAsyncComponent,
  shallowRef,
} from "vue";
import { useI18n } from "vue-i18n";

import ShiftTabletService from "@/services/ShiftTabletService";
import ShiftTabletCrewService from "@/services/ShiftTabletCrewService";

import useApiErrorStore from "@/stores/api-error";
import {
  ShiftTabletCrewInputModel,
  ShiftTabletCrewSearchModel,
  ShiftTabletCrewViewModel,
} from "@/models/ShiftTabletCrewModels";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import {
  ResourceTypeSearchModel,
  ResourceTypeViewModel,
} from "@/models/ResourceTypeModels";
import { AgentSearchModel, AgentViewModel } from "@/models/AgentModels";
import { useRouter, useRoute } from "vue-router";
import AgentService from "@/services/AgentService";
import ResourceTypeService from "@/services/ResourceTypeService";
import {
  ShiftTabletSearchModel,
  ShiftTabletViewModel,
} from "@/models/ShiftTabletModels";
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
const loading = ref(false);
const totalRecords = ref(0);

const cuShiftTabletCrewId = ref(0);

const ShiftTabletCrewCreateView = defineAsyncComponent(
  () => import("@/views/shift-tablet-crew/ShiftTabletCrewCreate.vue")
);
const ShiftTabletCrewAgentReplacementView = defineAsyncComponent(
  () => import("@/views/shift-tablet-crew/ShiftTabletCrewAgentReplacement.vue")
);

const cuComponent = shallowRef();

const createUpdateFormIsVisible = ref(false);
const searchFormIsVisible = ref(false);

const openCreateUpdateForm = () => {
  createUpdateFormIsVisible.value = true;
};
const closeCreateUpdateForm = () => {
  cuShiftTabletCrewId.value = 0;
  createUpdateFormIsVisible.value = false;
};
const toggleCreateUpdateForm = () => {
  cuShiftTabletCrewId.value = 0;
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
        label: t("menu.item.agentReplacement"),
        icon: "pi pi-user-edit",
        command: () => {
          cuComponent.value = ShiftTabletCrewAgentReplacementView;
          closeSearchForm();
          cuShiftTabletCrewId.value = gridOperationMenu.value.dataId;
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
              shiftTabletCrewService.value
                .deleteShiftTabletCrew({
                  id: gridOperationMenu.value.dataId,
                } as ShiftTabletCrewInputModel)
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

const shiftTabletCrews = ref<ShiftTabletCrewViewModel[]>();
const jobs = ref<ResourceTypeViewModel[]>();
const agents = ref<AgentViewModel[]>();
const agent = ref<AgentViewModel>();
const job = ref<ResourceTypeViewModel>();
const shiftTablet = ref<ShiftTabletViewModel>();

async function loadShiftTabletCrews(searchParams?: ShiftTabletCrewSearchModel) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = {
        pageSize: pageSize.value,
        pageNo: pageNumber.value,
        title: "",
        agentId: 0,
        agentName: "",
        desc: true,
        entranceTime: "",
        exitTime: "",
        fromDate: "",
        id: 0,
        isReplaced: null,
        orderKey: "id",
        resourceTypeId: 0,
        shifTabletId: 0,
        shiftTitle: "",
        toDate: "",
        isDeleted: false,
      } as ShiftTabletCrewSearchModel;
    }

    const shiftTabletCrewsResponse =
      await shiftTabletCrewService.value.getShiftTabletCrews(searchParams);

    shiftTabletCrews.value = shiftTabletCrewsResponse.data;
    totalRecords.value = shiftTabletCrewsResponse.totalCount;
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
  await loadShiftTabletCrews({
    shifTabletId: +route.params.shiftTabletId,
    pageSize: pageSize.value,
    pageNo: pageNumber.value,
    orderKey: "id",
    desc: true,

    agentId: agent.value?.id ?? 0,
    resourceTypeId: job.value?.id ?? 0,

    agentName: "",
    entranceTime: "",
    exitTime: "",
    fromDate: "",
    toDate: "",
    shiftTitle: "",
    isReplaced: null,
    id: 0,

    title: "",
    isDeleted: false,
  } as ShiftTabletCrewSearchModel);
};

const shiftTabletService = ref(new ShiftTabletService());
const shiftTabletCrewService = ref(new ShiftTabletCrewService());
const agentService = ref(new AgentService());
const jobService = ref(new ResourceTypeService());

const resetSearchForm = async () => {
  agent.value = undefined;
  job.value = undefined;

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

const onDropdownAgentFilter = async (event: any) => {
  try {
    agents.value = (
      await agentService.value.getAgents({
        pageNo: 0,
        pageSize: generalStore.dropdownItemsCount,
        orderKey: "id",
        id: 0,

        desc: true,
        firstName: event.value,
        lastName: "",
      } as AgentSearchModel)
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

const loadEssentials = async () => {
  try {
    // shiftTablet
    shiftTablet.value = (
      await shiftTabletService.value.getShiftTablets({
        id: +route.params.shiftTabletId,
        orderKey: "id",
        desc: true,
        pageSize: 1,
        pageNo: 0,
        title: "",
        fromDate: "",
        toDate: "",
        productionTypeId: 0,
        shiftTitle: "",
        shiftId: 0,
        shiftTabletCrewId: 0,
        shiftDate: "",
        shiftWorthPercent: "",
        isDeleted: false,
      } as ShiftTabletSearchModel)
    ).data[0];

    // agents
    agents.value = (
      await agentService.value.getAgents({
        pageSize: generalStore.dropdownItemsCount,
        orderKey: "id",
        pageNo: 0,
        desc: true,
        id: 0,
        firstName: "",
        lastName: "",
      } as AgentSearchModel)
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
    } else {
      router.push({ name: "shift-tablet" });
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
              @click.prevent="
                closeCreateUpdateForm();
                toggleSearchForm();
              "
            />
            <Button
              icon="pi pi-plus"
              class="p-button-rounded p-button-success ml-2"
              @click.prevent="
                cuComponent = ShiftTabletCrewCreateView;
                closeSearchForm();
                toggleCreateUpdateForm();
              "
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
                {{ t("portal.name") }}:
                <strong>{{ shiftTablet!.portalName }}</strong>
              </div>
              <div class="col">
                {{ t("shift.title") }}:
                <strong>{{ shiftTablet!.shiftTitle }}</strong>
              </div>
              <div class="col">
                {{ t("shiftDate.title") }}:
                <strong>{{ pdate(shiftTablet!.shiftDate) }}</strong>
              </div>
              <div class="col">
                {{ t("shift.startTime") }}:
                <strong>{{ shiftTablet!.shiftStartTime }}</strong>
              </div>
              <div class="col">
                {{ t("shift.endTime") }}:
                <strong>{{ shiftTablet!.shiftEndTime }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition>
      <div v-if="createUpdateFormIsVisible">
        <Component
          :is="cuComponent"
          :shift-tablet-crew-id="cuShiftTabletCrewId"
          :shift-tablet-id="+$route.params.shiftTabletId"
          @insert-is-done="insertIsDone"
          @update-is-done="updateIsDone"
          @cu-is-canceled="closeCreateUpdateForm"
        >
        </Component>
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
                  <div class="field col-12 mb-2 md:col-4">
                    <div class="p-float-label">
                      <Dropdown
                        id="agent"
                        v-model="agent"
                        :options="agents"
                        option-label="fullName"
                        :filter="true"
                        @filter="onDropdownAgentFilter"
                      />

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
                      />

                      <label for="job">{{
                        t("shiftTabletCrew.jobName")
                      }}</label>
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
              :value="shiftTabletCrews"
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
                field="agentFullName"
                :header="t('grid.header.agentFullName')"
              ></Column>
              <Column
                field="jobName"
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
                    aria-haspopup="true"
                    aria-controls="grid_operation_menu"
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
            >
            </Paginator>
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
