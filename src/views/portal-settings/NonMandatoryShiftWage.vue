<script lang="ts" setup>
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
const confirmGroup = uuidv4();

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

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const monetarySettingService = ref(new MonetarySettingService());
const portalService = ref(new PortalService());
const jobService = ref(new JobService());
const cooperationTypeService = ref(new CooperationTypeService());

const monetarySettings = ref<InstanceType<typeof MonetarySettingViewModel>[]>();
const portals = ref<InstanceType<typeof PortalViewModel>[]>();
const jobs = ref<InstanceType<typeof JobViewModel>[]>();
const cooperationTypes = ref<InstanceType<typeof CooperationTypeViewModel>[]>();

const state = reactive({
  portal: ref<InstanceType<typeof PortalViewModel>>(),
  cooperationType: ref<InstanceType<typeof CooperationTypeViewModel>>(),
  job: ref<InstanceType<typeof JobViewModel>>(),
  mandatoryShiftCount: ref<number | null>(null),
  nonMandatoryShiftWage: ref<number | null>(null),
});

const rules = {
  portal: { required },
  cooperationType: {
    required: requiredUnless(function () {
      return state.job !== undefined && state.job !== null;
    }),
  },
  job: {
    required: requiredUnless(function () {
      return (
        state.cooperationType !== undefined && state.cooperationType !== null
      );
    }),
  },
  mandatoryShiftCount: {},
  nonMandatoryShiftWage: { required, numeric, maxLengthValue: maxLength(11) },
};

const v$ = useVuelidate(rules, state);

const editingRows = ref<any[]>([]);
const selectedRows = ref<any[]>([]);

const onRowEditInit = async (event: any) => {
  const { data, newData, index } = event;

  editingRows.value = [data];

  v$.value.portal.$model =
    portals.value?.find((x) => x.id === data.portalId) ?? undefined;
  v$.value.cooperationType.$model =
    cooperationTypes.value?.find((x) => x.id === data.cooperationTypeId) ??
    undefined;
  v$.value.job.$model =
    jobs.value?.find((x) => x.id === data.jobId) ?? undefined;
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

    portalId: v$.value.portal.$model?.id,
    cooperationTypeId: v$.value.cooperationType.$model?.id,
    jobId: v$.value.job.$model?.id,
    //mandatoryShiftCount: v$.value.mandatoryShiftCount.$model,
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
  v$.value.portal.$model = undefined;
  v$.value.cooperationType.$model = undefined;
  v$.value.job.$model = undefined;
  v$.value.mandatoryShiftCount.$model = null;
  v$.value.nonMandatoryShiftWage.$model = null;

  // not admin
  if ((userStore.user?.portalId ?? 2147483647) > 1) {
    v$.value.portal.$model = portals.value?.find(
      (x) => x.id === userStore.user?.portalId
    );
  }

  if (monetarySettings.value!.filter((item) => item.id == 0).length == 0) {
    monetarySettings.value?.unshift(
      new MonetarySettingViewModel({
        id: 0,
      })
    );
  }

  editingRows.value = [monetarySettings.value![0]];
}

const confirmDeleteSelected = () => {
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
};

const formatCurrency = (value: number | null) => {
  if (!value) {
    return;
  }
  return value.toLocaleString("fa-IR", { style: "currency", currency: "IRR" });
};

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

        mandatoryField: "NonMandatoryShiftWage",
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

      mandatoryField: "NonMandatoryShiftWage",
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

onActivated(async () => {
  // called on initial mount
  // and every time it is re-inserted from the cache
});
</script>

<template>
  <div class="content-section">
    <div class="grid">
      <div class="col-12 md:col-12">
        <div class="card">
          <Toolbar class="mb-4">
            <template #end>
              <Button
                icon="pi pi-plus"
                class="p-button-success p-button-rounded ml-2"
                @click.prevent="openNew"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-danger p-button-rounded"
                :disabled="!selectedRows || !selectedRows.length"
                @click.prevent="confirmDeleteSelected"
              />
            </template>
          </Toolbar>

          <DataTable
            v-model:editing-rows="editingRows"
            v-model:selection="selectedRows"
            :value="monetarySettings"
            :filters="filters"
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
            <template #header>
              <div
                class="table-header flex flex-column md:flex-row md:justiify-content-between"
              >
                <span class="p-input-icon-right">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="filters['global'].value"
                    :placeholder="t('input.search')"
                  />
                </span>
              </div>
            </template>
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

            <Column
              field="portalTitle"
              :header="t('grid.header.portal')"
              :hidden="(userStore.user?.portalId ?? 2147483647) > 1"
            >
              <template #editor>
                <Dropdown
                  v-model="v$.portal.$model"
                  :options="portals"
                  option-label="title"
                  :filter="true"
                  :show-clear="true"
                  :class="{
                    'p-invalid': v$.portal.$invalid,
                  }"
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
                  v-model="v$.cooperationType.$model"
                  :options="cooperationTypes"
                  option-label="title"
                  :filter="true"
                  :show-clear="true"
                  :class="{
                    'p-invalid': v$.cooperationType.$invalid,
                  }"
                  ><template #empty>
                    {{ t("dropdown.slot.empty") }}
                  </template></Dropdown
                >
              </template>
            </Column>

            <Column field="jobTitle" :header="t('grid.header.jobTitle')">
              <template #editor>
                <Dropdown
                  v-model="v$.job.$model"
                  :options="jobs"
                  option-label="title"
                  :filter="true"
                  :show-clear="true"
                  :class="{
                    'p-invalid': v$.job.$invalid,
                  }"
                  ><template #empty>
                    {{ t("dropdown.slot.empty") }}
                  </template></Dropdown
                >
              </template>
            </Column>

            <Column
              field="nonMandatoryShiftWage"
              :header="t('grid.header.nonMandatoryShiftWage')"
            >
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.nonMandatoryShiftWage) }}
              </template>
              <template #editor>
                <InputNumber
                  v-model="v$.nonMandatoryShiftWage.$model"
                  :min="0"
                  :class="{
                    'p-invalid': v$.nonMandatoryShiftWage.$invalid,
                  }"
                />
              </template>
            </Column>

            <Column
              :row-editor="true"
              style="width: 10%; min-width: 8rem"
              body-style="text-align:center"
              :header="t('grid.button.operation')"
            ></Column>
            <template #empty>
              {{ t("grid.slot.empty") }}
            </template>
          </DataTable>
        </div>
      </div>
    </div>

    <Toast position="top-center" group="br" />
    <ConfirmDialog position="top-center" :group="confirmGroup"></ConfirmDialog>
  </div>
</template>

<style lang="scss" scoped></style>
