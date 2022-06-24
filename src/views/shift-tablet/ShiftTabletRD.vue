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
  ShiftProductionTypeViewModel,
  ShiftProductionTypeSearchModel,
  ShiftProductionTypeInputModel,
} from "@/models/ShiftProductionTypeModels";
import {
  ShiftDefinitionViewModel,
  ShiftDefinitionSearchModel,
  ShiftDefinitionInputModel,
} from "@/models/ShiftDefinitionModels";
import ShiftProductionTypeService from "@/services/ShiftProductionTypeService";
import ShiftDefinitionService from "@/services/ShiftDefinitionService";

import ShiftTabletCU from "@/views/shift-tablet/ShiftTabletCU.vue";
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from "vue-router";

const router = useRouter();

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(10);
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

const gridOperationMenu = ref();
const gridOperationMenuItems = ref([
  {
    label: t("grid.button.operation"),
    items: [
      {
        label: t("menu.item.shift-tablet-crew-assignment"),
        icon: "pi pi-users",
        command: () => {
          router.push({
            name: "shift-tablet-crew",
            params: { shiftTabletId: gridOperationMenu.value.dataId },
          });
        },
      },
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
                    throw new Error(
                      "Failed api call: [" + response.data.failureMessage + "]"
                    );
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
const shiftProductionType = ref<ShiftProductionTypeViewModel>();
const shiftDate = ref("");
const shiftWorthPercent = ref("");

const shiftTablets = ref<ShiftTabletViewModel[]>();
const shiftProductionTypes = ref<ShiftProductionTypeViewModel[]>();
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
        productionTypeId: 0,
        id: 0,
        shiftWorthPercent: "",
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
  pageNumber.value = event.page;
  await handleSearch();
};

const shiftTabletService = ref(new ShiftTabletService());
const shiftProductionTypeService = ref(new ShiftProductionTypeService());
const shiftDefinitionService = ref(new ShiftDefinitionService());

const handleSearch = async () => {
  await loadShiftTablets({
    pageSize: pageSize.value,
    pageNo: pageNumber.value,

    shiftId: shiftDefinition.value?.id ?? 0,
    productionTypeId: shiftProductionType.value?.id ?? 0,

    orderKey: "id",
    desc: true,
  } as ShiftTabletSearchModel);
};

const loadEssentials = async () => {
  try {
    // shiftProductionTypes
    shiftProductionTypes.value = (
      await shiftProductionTypeService.value.getShiftProductionTypes({
        pageSize: 2147483647, // Int32.MaxValue
        pageNo: 0,
        title: "",
        orderKey: "id",
        desc: true,
      } as ShiftProductionTypeSearchModel)
    ).data;

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
          @reload-grid="handleSearch()"
          @close-form="closeCreateUpdateForm()"
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
                      />

                      <label for="shiftDefinition">{{
                        t("shiftDefinition.title")
                      }}</label>
                    </div>
                  </div>

                  <div class="field col-12 mb-4 md:col-4">
                    <div class="p-float-label">
                      <Dropdown
                        id="shiftProductionType"
                        v-model="shiftProductionType"
                        :options="shiftProductionTypes"
                        option-label="title"
                      />

                      <label for="shiftProductionType">{{
                        t("productionType.title")
                      }}</label>
                    </div>
                  </div>

                  <div class="field col-12 mb-4 md:col-4">
                    <div class="p-float-label">
                      <!-- <InputText id="shiftDate" v-model="shiftDate" /> -->
                      <PersianDatePicker
                        v-model="shiftDate"
                        format="YYYY-MM-DD"
                        display-format="jYYYY-jMM-jDD"
                      />
                      <label for="shiftDate">{{ t("shiftDate.title") }}</label>
                    </div>
                  </div>

                  <div class="field col-12 mb-4 md:col-4">
                    <div class="p-float-label">
                      <InputText
                        id="shiftWorthPercent"
                        v-model="shiftWorthPercent"
                      />
                      <label for="shiftWorthPercent">{{
                        t("shiftWorthPercent.title")
                      }}</label>
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
              :value="shiftTablets"
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
                field="shiftTitle"
                :header="t('grid.header.shiftTitle')"
              ></Column>
              <Column
                field="productionTypeTitle"
                :header="t('grid.header.productionTypeTitle')"
              ></Column>
              <Column
                field="shiftDate"
                :header="t('grid.header.shiftDate')"
              ></Column>
              <Column
                field="shiftWorthPercent"
                :header="t('grid.header.shiftWorthPercent')"
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
