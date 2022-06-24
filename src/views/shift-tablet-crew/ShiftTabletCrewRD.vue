<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";

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

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(10);
const pageNumber = ref(0);
const loading = ref(false);
const totalRecords = ref(0);

const cuShiftTabletCrewId = ref(0);
const cuComponentName = ref("");

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
          cuComponentName.value = "ShiftTabletCrewAgentReplacement";
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
  } as ShiftTabletCrewSearchModel);
};

const shiftTabletCrewService = ref(new ShiftTabletCrewService());
const agentService = ref(new AgentService());
const jobService = ref(new ResourceTypeService());

const loadEssentials = async () => {
  try {
    // agents
    agents.value = (
      await agentService.value.getAgents({
        pageSize: 2147483647, // Int32.MaxValue
        pageNo: 0,
        orderKey: "id",
        desc: true,
        id: 0,
        firstName: "",
        lastName: "",
      } as AgentSearchModel)
    ).data;

    // jobs
    jobs.value = (
      await jobService.value.getResourceTypes({
        pageSize: 2147483647, // Int32.MaxValue
        pageNo: 0,
        orderKey: "id",
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
      await handleSearch();
    }
  },
  { immediate: true }
);

// lifecycle hooks
onMounted(async () => {
  if (!route.params.shiftTabletId) {
    router.push({ name: "shift-tablet" });
  }

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
              class="p-button-rounded p-button-success ml-2"
              @click.prevent="
                cuComponentName = 'ShiftTabletCrewCreate';
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

    <Transition>
      <div v-if="createUpdateFormIsVisible">
        <Component
          :is="cuComponentName"
          :shift-tablet-crew-id="cuShiftTabletCrewId"
          :shift-tablet-id="+$route.params.shiftTabletId"
          @reload-grid="handleSearch()"
          @close-form="closeCreateUpdateForm()"
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
                  <div class="field col-12 mb-2 md:col-4 md:mb-0">
                    <div class="p-float-label">
                      <Dropdown
                        id="agent"
                        v-model="agent"
                        :options="agents"
                        option-label="fullName"
                        :filter="true"
                      />

                      <label for="agent">{{ t("agent.name") }}</label>
                    </div>
                  </div>
                  <div class="field col-12 mb-2 md:col-4 md:mb-0">
                    <div class="p-float-label">
                      <Dropdown
                        id="job"
                        v-model="job"
                        :options="jobs"
                        option-label="title"
                        :filter="true"
                      />

                      <label for="job">{{ t("job.name") }}</label>
                    </div>
                  </div>
                </div>

                <div class="grid formgrid">
                  <div class="col-12 mb-2 md:col-1 md:mb-0">
                    <Button
                      type="submit"
                      :label="t('button.search')"
                      class="mt-4"
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
              :rows="10"
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
                    @click="toggleGridOperationMenu($event, slotProps.data.id)"
                  />
                </template>
              </Column>
            </DataTable>

            <Paginator
              :rows="10"
              :total-records="totalRecords"
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
