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
const confirmGroup = uuidv4();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);
const loading = ref(true);
const totalRecords = ref(0);

const submitButtonIsLoading = ref(false);

const cuShiftTabletCrewId = ref(0);
const shiftTabletCrewIsReplacement = ref(false);

const ShiftTabletCrewCreateView = defineAsyncComponent(
  () => import("./ShiftTabletCrewCreate.vue")
);
const ShiftTabletCrewAgentReplacementView = defineAsyncComponent(
  () => import("./ShiftTabletCrewAgentReplacement.vue")
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
        label: t("menu.item.update"),
        icon: "pi pi-user-edit",
        command: () => {
          cuComponent.value = ShiftTabletCrewAgentReplacementView;
          closeSearchForm();
          cuShiftTabletCrewId.value = gridOperationMenu.value.data.id;
          shiftTabletCrewIsReplacement.value = false;
          openCreateUpdateForm();
        },
      },
      {
        label: t("menu.item.replacement"),
        icon: "pi pi-user-edit",
        command: () => {
          cuComponent.value = ShiftTabletCrewAgentReplacementView;
          closeSearchForm();
          cuShiftTabletCrewId.value = gridOperationMenu.value.data.id;
          shiftTabletCrewIsReplacement.value = true;
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
              shiftTabletCrewService.value
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

const shiftTabletCrews = ref<InstanceType<typeof ShiftTabletCrewViewModel>[]>();
const jobs = ref<InstanceType<typeof JobViewModel>[]>();
const job = ref<InstanceType<typeof JobViewModel>>();
const agents = ref<InstanceType<typeof AgentViewModel>[]>();
const agent = ref<InstanceType<typeof AgentViewModel>>();
const shiftTablet = ref<InstanceType<typeof ShiftTabletViewModel>>();

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
      apiErrorStore.setApiErrorMessage(error.message.message);
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
      apiErrorStore.setApiErrorMessage(error.message.message);
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
                  pdate(shiftTablet?.shiftDate ?? "", "dddd?? jYYYY/jMM/jDD")
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
      <div v-if="createUpdateFormIsVisible">
        <Component
          :is="cuComponent"
          :shift-tablet-crew-is-replacement="shiftTabletCrewIsReplacement"
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
  <ConfirmDialog position="top-center" :group="confirmGroup"></ConfirmDialog>
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
