<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";

const generalStore = useGeneralStore();

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);
const loading = ref(true);
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
                .delete(
                  new ShiftDefinitionInputModel({
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

const displayShiftDefinitionTemplateModal = ref(false);
const shiftDefinitionId = ref<number>(0);
const openShiftDefinitionTemplateModal = async (_shiftDefinitionId: number) => {
  shiftDefinitionId.value = _shiftDefinitionId;

  displayShiftDefinitionTemplateModal.value = true;
};
const shiftDefinitions = ref<InstanceType<typeof ShiftDefinitionViewModel>[]>();
const portals = ref<InstanceType<typeof PortalViewModel>[]>();
const shiftTypes = ref<InstanceType<typeof ShiftTypeViewModel>[]>([
  { id: 1, title: t("shift.type.regie") },
  { id: 2, title: t("shift.type.coordinator") },
]);

async function loadShiftDefinitions(
  searchParams?: InstanceType<typeof ShiftDefinitionSearchModel>
) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = new ShiftDefinitionSearchModel({
        pageSize: pageSize.value,
        pageNo: pageNumber.value,
      });
    }

    const shiftDefinitionsResponse = await shiftDefinitionService.value.getAll(
      searchParams
    );

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
  await loadShiftDefinitions(
    new ShiftDefinitionSearchModel({
      pageSize: pageSize.value,
      pageNo: pageNumber.value,
      portalId: portal.value?.id ?? 0,
      title: shiftTitle.value ?? "",
      shiftType: shiftType.value?.id ?? 0,
      orderKey: "id",
      desc: true,
      isDeleted: false,
      id: 0,
    })
  );
};
const shiftTitle = ref("");
const portal = ref<InstanceType<typeof PortalViewModel>>();
const shiftType = ref<InstanceType<typeof ShiftTypeViewModel>>();

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
      await portalService.value.getAll(new PortalSearchModel({}))
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
                        ><template #empty>
                          {{ t("dropdown.slot.empty") }}
                        </template></Dropdown
                      >

                      <label for="portal">{{ t("portal.title") }}</label>
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
                        ><template #empty>
                          {{ t("dropdown.slot.empty") }}
                        </template></Dropdown
                      >

                      <label for="shiftType">{{ t("shiftType.title") }}</label>
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

  <Dialog
    v-model:visible="displayShiftDefinitionTemplateModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '50vw' }"
    :modal="true"
    :closable="true"
    :dismissable-mask="true"
    :close-on-escape="true"
  >
    <ShiftDefinitionTemplate
      :shift-definition-id="shiftDefinitionId"
    ></ShiftDefinitionTemplate>
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
