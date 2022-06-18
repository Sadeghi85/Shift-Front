<script lang="ts" setup>
import { reactive, ref, onMounted, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ShiftProductionTypeService from "@/services/ShiftProductionTypeService";
import { useToast } from "primevue/usetoast";
import {
  ShiftProductionTypeViewModel,
  ShiftProductionTypeSearchModel,
  ShiftProductionTypeInputModel,
} from "@/models/ShiftProductionTypeModels";
import ShiftProductionTypeCU from "@/views/shift-production-type/ShiftProductionTypeCU.vue";

// reactive state
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

const toggleCreateUpdateForm = (id?: number) => {
  if (id) {
    cuShiftProductionTypeId.value = id;
  } else {
    cuShiftProductionTypeId.value = 0;
  }

  createUpdateFormIsVisible.value = !createUpdateFormIsVisible.value;
};

const toggleSearchForm = () => {
  searchFormIsVisible.value = !searchFormIsVisible.value;
};

////////
const { t } = useI18n();

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
    title: productionTypeTitle.value ? productionTypeTitle.value : "",
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
        <ShiftProductionTypeCU
          :shift-production-type-id="cuShiftProductionTypeId"
          @reload-grid="handleSearch()"
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
                field="title"
                :header="t('grid.header.productionType')"
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
