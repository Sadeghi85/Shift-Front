<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import ShiftProductionTypeService from "@/services/ShiftProductionTypeService";
import { useToast } from "primevue/usetoast";
import {
  ShiftProductionTypeViewModel,
  ShiftProductionTypeSearchModel,
  ShiftProductionTypeInputModel,
} from "@/models/ShiftProductionTypeModels";
import ShiftProductionTypeCU from "@/views/shift-production-type/ShiftProductionTypeCU.vue";
import { useConfirm } from "primevue/useconfirm";

// reactive state
const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const pageSize = ref(10);
const pageNumber = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const submitted = ref(false);
const productionTypeTitle = ref("");

const productionTypes = ref<ShiftProductionTypeViewModel[]>();

const cuShiftProductionTypeId = ref(0);

const createUpdateFormIsVisible = ref(false);
const searchFormIsVisible = ref(false);

const openCreateUpdateForm = () => {
  createUpdateFormIsVisible.value = true;
};
const closeCreateUpdateForm = () => {
  cuShiftProductionTypeId.value = 0;
  createUpdateFormIsVisible.value = false;
};
const toggleCreateUpdateForm = () => {
  cuShiftProductionTypeId.value = 0;
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
        icon: "pi pi-refresh",
        command: () => {
          closeSearchForm();
          cuShiftProductionTypeId.value = gridOperationMenu.value.dataId;
          openCreateUpdateForm();
        },
      },
      {
        label: t("menu.item.delete"),
        icon: "pi pi-times",
        command: () => {
          //showConfirmDelete();

          confirm.require({
            message: t("confirm.message.delete"),
            header: t("confirm.header.confirmation"),
            icon: "pi pi-exclamation-triangle",
            acceptClass: "p-button-danger",
            acceptLabel: t("confirm.button.accept"),
            rejectLabel: t("confirm.button.reject"),
            defaultFocus: "reject",
            accept: () => {
              // shiftLocationService.value
              //   .deleteShiftLocation({
              //     id: gridOperationMenu.value.dataId,
              //   } as ShiftLocationInputModel)
              //   .then((response) => {
              //     //console.log(response);
              //     if (!response.data.success) {
              //       throw new Error(
              //         "Failed api call: [" + response.data.failureMessage + "]"
              //       );
              //     }
              //     showSuccess(t("toast.success.delete"));
              //   })
              //   .catch((error) => {
              //     console.log(error);
              //   });
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

////////

const shiftProductionTypeService = ref(new ShiftProductionTypeService());

// functions that mutate state and trigger updates

const onPage = (event: any) => {
  pageNumber.value = event.page;
  handleSearch();
};
function loadProductionTypes(searchParams?: ShiftProductionTypeSearchModel) {
  loading.value = true;

  if (!searchParams) {
    searchParams = {
      pageSize: pageSize.value,
      pageNo: pageNumber.value,
      title: "",
      orderKey: "id",
      desc: true,
    } as ShiftProductionTypeSearchModel;
  }

  shiftProductionTypeService.value
    .getShiftProductionTypes(searchParams)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      productionTypes.value = response.data.data;
      totalRecords.value = response.data.totalCount;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}

const handleSearch = () => {
  loadProductionTypes({
    pageSize: pageSize.value,
    pageNo: pageNumber.value,
    title: productionTypeTitle.value ?? "",
    orderKey: "id",
    desc: true,
  } as ShiftProductionTypeSearchModel);
};

// lifecycle hooks
onMounted(() => {
  // productionTypes
  handleSearch();
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
        <ShiftProductionTypeCU
          :shift-production-type-id="cuShiftProductionTypeId"
          @reload-grid="handleSearch()"
          @close-form="closeCreateUpdateForm()"
        >
        </ShiftProductionTypeCU>
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
                  <div class="col-12 mb-2 md:col-4 md:mb-0">
                    <div class="p-float-label">
                      <InputText
                        id="productionTypeTitle"
                        v-model="productionTypeTitle"
                      />
                      <label for="productionTypeTitle">{{
                        t("productionType.title")
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
              :value="productionTypes"
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
                field="title"
                :header="t('grid.header.productionType')"
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
