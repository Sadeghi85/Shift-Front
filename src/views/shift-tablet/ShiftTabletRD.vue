<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
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

const { t } = useI18n();
const pageSize = ref(10);
const pageNumber = ref(0);

const loading = ref(false);
const totalRecords = ref(0);

const cuShiftTabletId = ref(0);

const createUpdateFormIsVisible = ref(false);
const searchFormIsVisible = ref(false);

const toggleCreateUpdateForm = (id?: number) => {
  if (id) {
    cuShiftTabletId.value = id;
  } else {
    cuShiftTabletId.value = 0;
  }

  createUpdateFormIsVisible.value = !createUpdateFormIsVisible.value;
};

const toggleSearchForm = () => {
  searchFormIsVisible.value = !searchFormIsVisible.value;
};

const shiftDefinition = ref<ShiftDefinitionViewModel>();
const shiftProductionType = ref<ShiftProductionTypeViewModel>();
const shiftDate = ref("");
const shiftWorthPercent = ref("");

const shiftTablets = ref<ShiftTabletViewModel[]>();
const shiftProductionTypes = ref<ShiftProductionTypeViewModel[]>();
const shiftDefinitions = ref<ShiftDefinitionViewModel[]>();

function loadShiftTablets(searchParams?: ShiftTabletSearchModel) {
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

  shiftTabletService.value
    .getShiftTablets(searchParams)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftTablets.value = response.data.data;
      totalRecords.value = response.data.totalCount;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}

const onPage = (event: any) => {
  pageNumber.value = event.page;
  handleSearch();
};

const shiftTabletService = ref(new ShiftTabletService());
const shiftProductionTypeService = ref(new ShiftProductionTypeService());
const shiftDefinitionService = ref(new ShiftDefinitionService());

const toast = useToast();

function loadShiftProductionTypes() {
  shiftProductionTypeService.value
    .getShiftProductionTypes({
      pageNo: 0,
      pageSize: 10,
      orderKey: "",
      id: 0,
      title: "",
    } as ShiftProductionTypeSearchModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftProductionTypes.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadShiftDefinitions() {
  shiftDefinitionService.value
    .getShiftDefinitions({
      pageNo: 0,
      pageSize: 10,
      orderKey: "",
      id: 0,
      title: "",
    } as ShiftDefinitionSearchModel)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftDefinitions.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const handleSearch = () => {
  loadShiftTablets({
    pageSize: pageSize.value,
    pageNo: pageNumber.value,

    shiftId: shiftDefinition.value?.id ?? 0,
    productionTypeId: shiftProductionType.value?.id ?? 0,

    orderKey: "id",
    desc: true,
  } as ShiftTabletSearchModel);
};

// lifecycle hooks
onMounted(() => {
  // load shift production types
  loadShiftProductionTypes();
  // load shift definitions
  loadShiftDefinitions();

  // shiftTablets
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
              class="ml-2"
              @click.prevent="toggleSearchForm()"
            />
            <Button
              icon="pi pi-plus"
              class="p-button-success"
              @click.prevent="toggleCreateUpdateForm()"
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
                      <InputText id="shiftDate" v-model="shiftDate" />
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
              <Column :header="t('grid.header.index')">
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

  <Toast position="top-center" group="br" />
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
