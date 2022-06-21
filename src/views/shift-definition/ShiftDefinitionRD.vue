<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import PortalService from "@/services/PortalService";
import ShiftDefinitionService from "@/services/ShiftDefinitionService";
import { usePortalStore } from "@/stores/portal";
import { PortalSearchModel, PortalViewModel } from "@/models/PortalModels";
import { useToast } from "primevue/usetoast";
import {
  ShiftDefinitionViewModel,
  ShiftDefinitionInputModel,
  ShiftDefinitionSearchModel,
} from "@/models/ShiftDefinitionModels";
import { ShiftTypeViewModel } from "@/models/ShiftTypeModels";

import ShiftDefinitionCU from "@/views/shift-definition/ShiftDefinitionCU.vue";

const { t } = useI18n();
const pageSize = ref(10);
const pageNumber = ref(0);
const loading = ref(false);
const totalRecords = ref(0);

const cuShiftDefinitionId = ref(0);

const createUpdateFormIsVisible = ref(false);
const searchFormIsVisible = ref(false);

const toggleCreateUpdateForm = (id?: number) => {
  if (id) {
    cuShiftDefinitionId.value = id;
  } else {
    cuShiftDefinitionId.value = 0;
  }

  createUpdateFormIsVisible.value = !createUpdateFormIsVisible.value;
};

const toggleSearchForm = () => {
  searchFormIsVisible.value = !searchFormIsVisible.value;
};

const shiftDefinitions = ref<ShiftDefinitionViewModel[]>();
const portals = ref<PortalViewModel[]>();
const shiftTypes = ref<ShiftTypeViewModel[]>([
  { id: 1, title: t("shift.type.regie") },
  { id: 2, title: t("shift.type.coordinator") },
]);

function loadShiftDefinitions(searchParams?: ShiftDefinitionSearchModel) {
  loading.value = true;

  if (!searchParams) {
    searchParams = {
      pageSize: pageSize.value,
      pageNo: pageNumber.value,
      title: "",
    } as ShiftDefinitionSearchModel;
  }

  shiftDefinitionService.value
    .getShiftDefinitions(searchParams)
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      shiftDefinitions.value = response.data.data;
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

const handleSearch = () => {
  loadShiftDefinitions({
    pageSize: pageSize.value,
    pageNo: pageNumber.value,
    portalId: portal.value?.id ?? 0,
    title: shiftTitle.value ?? "",
    shiftType: shiftType.value?.id ?? 0,
    orderKey: "id",
    desc: true,
  } as ShiftDefinitionSearchModel);
};
const shiftTitle = ref("");
const portal = ref<PortalViewModel>();
const shiftType = ref<ShiftTypeViewModel>();

const portalService = ref(new PortalService());
const shiftDefinitionService = ref(new ShiftDefinitionService());
const portalStore = usePortalStore();

const toast = useToast();

function loadPortals() {
  if (portalStore.portals.length == 0) {
    portalService.value
      .getPortals({
        pageNo: 0,
        pageSize: 2147483647, // Int32.MaxValue
        portalId: 0,
        title: "",
        orderKey: "",
      } as PortalSearchModel)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        portalStore.setPortals(response.data.data);
        portals.value = portalStore.portals;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    portals.value = portalStore.portals;
  }
}

// lifecycle hooks
onMounted(() => {
  // portals
  loadPortals();

  // shiftDefinitions
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
        <ShiftDefinitionCU
          :shift-definition-id="cuShiftDefinitionId"
          @reload-grid="handleSearch()"
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
                  <div class="col-12 mb-2 md:col-4 md:mb-0">
                    <div class="p-float-label">
                      <InputText id="shiftTitle" v-model="shiftTitle" />
                      <label for="shiftTitle">{{ t("shift.title") }}</label>
                    </div>
                  </div>
                  <div class="field col-12 mb-2 md:col-4 md:mb-0">
                    <div class="p-float-label">
                      <Dropdown
                        id="portal"
                        v-model="portal"
                        :options="portals"
                        option-label="title"
                      />

                      <label for="portal">{{ t("portal.name") }}</label>
                    </div>
                  </div>

                  <div class="field col-12 mb-2 md:col-4 md:mb-0">
                    <div class="p-float-label">
                      <Dropdown
                        id="shiftType"
                        v-model="shiftType"
                        :options="shiftTypes"
                        option-label="title"
                      />

                      <label for="shiftType">{{ t("shiftType.title") }}</label>
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
              :value="shiftDefinitions"
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
