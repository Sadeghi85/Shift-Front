<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";
import { PortalSearchModel, PortalViewModel } from "@/models/PortalModels";

const generalStore = useGeneralStore();

// reactive state
const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);
const loading = ref(true);
const totalRecords = ref(0);

const cuLocationId = ref(0);

const createUpdateFormIsVisible = ref(false);
const searchFormIsVisible = ref(false);

const openCreateUpdateForm = () => {
  createUpdateFormIsVisible.value = true;
};
const closeCreateUpdateForm = () => {
  cuLocationId.value = 0;
  createUpdateFormIsVisible.value = false;
};
const toggleCreateUpdateForm = () => {
  cuLocationId.value = 0;
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
          cuLocationId.value = gridOperationMenu.value.dataId;
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
              locationService.value
                .deleteLocation(
                  new LocationInputModel({
                    id: gridOperationMenu.value.dataId,
                  })
                )
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
  //cuLocationId.value = id;
  gridOperationMenu.value.dataId = id;
  gridOperationMenu.value.toggle(event);
};

const locations = ref<InstanceType<typeof LocationViewModel>[]>();
const portals = ref<InstanceType<typeof PortalViewModel>[]>();

const showSuccess = (detail: string) => {
  toast.add({
    severity: "success",
    summary: t("toast.header.general"),
    detail: detail,
    life: 3000,
    group: "br",
  });
};

const locationName = ref("");
const portal = ref<InstanceType<typeof PortalViewModel>>();

////////

const portalService = ref(new PortalService());
const locationService = ref(new LocationService());

// functions that mutate state and trigger updates
const onPage = async (event: any) => {
  generalStore.rowPerPage = event.rows;

  pageSize.value = event.rows;
  pageNumber.value = event.page;
  await handleSearch();
};

async function loadLocations(
  searchParams?: InstanceType<typeof LocationSearchModel>
) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = new LocationSearchModel({
        pageSize: pageSize.value,
        pageNo: pageNumber.value,
      });
    }

    const locationResponse = await locationService.value.getLocations(
      searchParams
    );

    locations.value = locationResponse.data;
    totalRecords.value = locationResponse.totalCount;
    loading.value = false;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
}

const handleSearch = async () => {
  await loadLocations(
    new LocationSearchModel({
      pageSize: pageSize.value,
      pageNo: pageNumber.value,
      title: locationName.value ?? "",
      orderKey: "id",
      desc: true,
      isDeleted: false,
    })
  );
};

const resetSearchForm = async () => {
  portal.value = undefined;
  locationName.value = "";

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
      await portalService.value.getPortals(new PortalSearchModel({}))
    ).data;

    // locations
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
        <LocationCU
          :shift-location-id="cuLocationId"
          @insert-is-done="insertIsDone"
          @update-is-done="updateIsDone"
          @cu-is-canceled="closeCreateUpdateForm"
        >
        </LocationCU>
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
                      <InputText id="locationName" v-model="locationName" />
                      <label for="locationName">{{ t("location.name") }}</label>
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
                        ><template #empty>
                          {{ t("dropdown.slot.empty") }}
                        </template></Dropdown
                      >

                      <label for="portal">{{ t("portal.name") }}</label>
                    </div>
                  </div>
                </div>

                <div class="grid align-center">
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
              :value="locations"
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
                :header="t('grid.header.location')"
              ></Column>
              <Column
                field="portalTitle"
                :header="t('grid.header.portal')"
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
                      toggleGridOperationMenu($event, slotProps.data.id)
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
