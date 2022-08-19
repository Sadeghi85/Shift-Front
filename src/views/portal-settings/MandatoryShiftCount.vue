<script lang="ts" setup>
import RoleTypes from "@/enums/RoleType";
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const generalStore = useGeneralStore();

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const apiErrorStore = useApiErrorStore();

const pageSize = ref(generalStore.rowPerPage);
const pageNumber = ref(0);
const loading = ref(true);
const totalRecords = ref(0);

const showSuccess = (detail: string) => {
  toast.add({
    severity: "success",
    summary: t("toast.header.general"),
    detail: detail,
    life: 3000,
    group: "br",
  });
};

const monetarySettingService = ref(new MonetarySettingService());
const portalService = ref(new PortalService());
const jobService = ref(new JobService());
const cooperationTypeService = ref(new CooperationTypeService());

const monetarySettings = ref<InstanceType<typeof MonetarySettingViewModel>[]>();
const portals = ref<InstanceType<typeof PortalViewModel>[]>();
const jobs = ref<InstanceType<typeof JobViewModel>[]>();
const cooperationTypes = ref<InstanceType<typeof CooperationTypeViewModel>[]>();

const state = reactive({
  portalId: ref<number | undefined>(undefined),
  cooperationTypeId: ref<number | null>(null),
  jobId: ref<number | null>(null),
  mandatoryShiftCount: ref<number | null>(null),
  nonMandatoryShiftWage: ref<number | null>(null),
});

const rules = {
  portalId: { required, numeric },
  cooperationTypeId: { numeric },
  jobId: { numeric },
  mandatoryShiftCount: { required, numeric },
  nonMandatoryShiftWage: { numeric },
};

const v$ = useVuelidate(rules, state);

const editingRows = ref<any[]>([]);
const selectedRows = ref<any[]>([]);

const onRowEditInit = async (event: any) => {
  const { data, newData, index } = event;

  editingRows.value = [data];

  v$.value.portalId.$model = data.portalId ?? userStore.user?.portalId;
  v$.value.cooperationTypeId.$model = data.cooperationTypeId ?? null;
  v$.value.jobId.$model = data.jobId ?? null;
  v$.value.mandatoryShiftCount.$model = data.mandatoryShiftCount ?? null;
  v$.value.nonMandatoryShiftWage.$model = data.nonMandatoryShiftWage ?? null;
};

const onRowEditSave = async (event: any) => {
  const { data, newData, index } = event;

  //console.log(newData);

  if (v$.value.$invalid) {
    editingRows.value = [event.data];
    return;
  }

  const monetarySetting = new MonetarySettingInputModel({
    id: data.id,

    portalId: v$.value.portalId.$model,
    cooperationTypeId: v$.value.cooperationTypeId.$model,
    jobId: v$.value.jobId.$model,
    mandatoryShiftCount: v$.value.mandatoryShiftCount.$model,
    nonMandatoryShiftWage: v$.value.nonMandatoryShiftWage.$model,
  });

  await monetarySettingService.value
    .createOrUpdate(monetarySetting)
    .then((response) => {
      if (response.data.success == false) {
        apiErrorStore.setApiErrorMessage(response.data.message);
      } else {
        showSuccess(t("toast.success.save"));

        handleSearch();
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
};

function openNew() {
  if (monetarySettings.value!.filter((item) => item.id == 0).length > 0) {
    return;
  }

  v$.value.portalId.$model = undefined;
  v$.value.cooperationTypeId.$model = null;
  v$.value.jobId.$model = null;
  v$.value.mandatoryShiftCount.$model = null;
  v$.value.nonMandatoryShiftWage.$model = null;

  monetarySettings.value?.unshift(
    new MonetarySettingViewModel({
      id: 0,
    })
  );

  editingRows.value = [monetarySettings.value![0]];
}

function confirmDeleteSelected() {
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
      const selectedIds = selectedRows.value
        .filter((row) => row.id != 0)
        .map((row) => row.id);

      if (selectedIds.length == 0) {
        handleSearch();
        selectedRows.value = [];
        return;
      } else {
        monetarySettingService.value
          .deleteMultiple(selectedIds)
          .then((response) => {
            //console.log(response);
            if (!response.data.success) {
              apiErrorStore.setApiErrorMessage(response.data.message);
              handleSearch();
              selectedRows.value = [];
              return;
            }

            handleSearch();
            selectedRows.value = [];
            showSuccess(t("toast.success.delete"));
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    reject: () => {
      //console.log("reject");
    },
  });
}

async function loadMonetarySettings(
  searchParams?: InstanceType<typeof MonetarySettingSearchModel>
) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = new MonetarySettingSearchModel({
        pageSize: 2147483647, // Int32.MaxValue
        pageNo: 0,
        orderKey: "portalId",
        desc: true,

        mandatoryField: "MandatoryShiftCount",
      });
    }

    const monetarySettingResponse = await monetarySettingService.value.getAll(
      searchParams
    );

    monetarySettings.value = monetarySettingResponse.data;
    totalRecords.value = monetarySettingResponse.totalCount;

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

const handleSearch = async () => {
  await loadMonetarySettings(
    new MonetarySettingSearchModel({
      pageSize: 2147483647, // Int32.MaxValue
      pageNo: 0,
      orderKey: "portalId",
      desc: true,

      mandatoryField: "MandatoryShiftCount",
    })
  );
};

const loadEssentials = async () => {
  try {
    // portals
    portals.value = (
      await portalService.value.getAll(new PortalSearchModel({}))
    ).data;

    // jobs
    jobs.value = (
      await jobService.value.getAll(
        new JobSearchModel({
          pageSize: 2147483647, // Int32.MaxValue
        })
      )
    ).data;

    // cooperation types
    cooperationTypes.value = (
      await cooperationTypeService.value.getAll(
        new CooperationTypeSearchModel({})
      )
    ).data;

    // MonetarySettings
    await handleSearch();
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
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
  <div class="content-section">
    <div class="grid">
      <div class="col-12 md:col-12">
        <div class="card">
          <Toolbar class="mb-4">
            <template #start>
              <Button
                :label="t('button.new')"
                icon="pi pi-plus"
                class="p-button-success ml-2"
                @click="openNew"
              />
              <Button
                :label="t('button.delete')"
                icon="pi pi-trash"
                class="p-button-danger"
                :disabled="!selectedRows || !selectedRows.length"
                @click="confirmDeleteSelected"
              />
            </template>
          </Toolbar>

          <DataTable
            v-model:editing-rows="editingRows"
            v-model:selection="selectedRows"
            :value="monetarySettings"
            data-key="id"
            edit-mode="row"
            :loading="loading"
            show-gridlines
            striped-rows
            :row-hover="true"
            responsive-layout="scroll"
            @row-edit-save="onRowEditSave"
            @row-edit-init="onRowEditInit"
          >
            <Column
              selection-mode="multiple"
              style="width: 3rem"
              :exportable="false"
            ></Column>

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

            <Column field="portalTitle" :header="t('grid.header.portal')">
              <template #editor>
                <Dropdown
                  v-model="v$.portalId.$model"
                  :options="portals"
                  option-label="title"
                  :filter="true"
                  :show-clear="true"
                  ><template #empty>
                    {{ t("dropdown.slot.empty") }}
                  </template></Dropdown
                >
              </template>
            </Column>
            <Column
              field="cooperationTypeTitle"
              :header="t('grid.header.cooperationType')"
            >
              <template #editor>
                <Dropdown
                  v-model="v$.cooperationTypeId.$model"
                  :options="cooperationTypes"
                  option-label="title"
                  :filter="true"
                  :show-clear="true"
                  ><template #empty>
                    {{ t("dropdown.slot.empty") }}
                  </template></Dropdown
                >
              </template>
            </Column>

            <Column field="jobTitle" :header="t('grid.header.jobTitle')">
              <template #editor>
                <Dropdown
                  v-model="v$.jobId.$model"
                  :options="jobs"
                  option-label="title"
                  :filter="true"
                  :show-clear="true"
                  ><template #empty>
                    {{ t("dropdown.slot.empty") }}
                  </template></Dropdown
                >
              </template>
            </Column>

            <Column
              field="jobTitle"
              :header="t('grid.header.mandatoryShiftCount')"
            >
              <template #editor>
                <InputNumber
                  v-model="v$.mandatoryShiftCount.$model"
                  :class="{
                    'p-invalid': v$.mandatoryShiftCount.$invalid,
                  }"
                />
              </template>
            </Column>

            <Column
              :row-editor="true"
              style="width: 10%; min-width: 8rem"
              body-style="text-align:center"
            ></Column>
            <template #empty>
              {{ t("grid.slot.empty") }}
            </template>
          </DataTable>
        </div>
      </div>
    </div>

    <Toast position="top-center" group="br" />
    <ConfirmDialog position="top-center"></ConfirmDialog>
  </div>
</template>

<style lang="scss" scoped></style>
