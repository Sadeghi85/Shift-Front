<script lang="ts" setup>
import jMoment from "moment-jalaali";
import useApiErrorStore from "@/stores/api-error";

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const confirmGroup = uuidv4();

const apiErrorStore = useApiErrorStore();

const loading = ref(false);
const submitButtonIsLoading = ref(false);
const calculateButtonIsLoading = ref(false);

const pageSize = ref(2147483647); // Int32.MaxValue
const pageNumber = ref(0);
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

const stateSearch = reactive({
  portal: ref<InstanceType<typeof PortalViewModel>>(),
  datePersian: ref(""),
});
const rulesSearch = {
  portal: { required },
  datePersian: { required },
};
const v$Search = useVuelidate(rulesSearch, stateSearch);

const stateGrid = reactive({
  finalPayment: ref<number | null>(null),
});
const rulesGrid = {
  finalPayment: { numeric, maxLengthValue: maxLength(11) },
};
const v$Grid = useVuelidate(rulesGrid, stateGrid);

const editingRows = ref<any[]>([]);

const onRowEditInit = async (event: any) => {
  const { data, newData, index } = event;

  editingRows.value = [data];

  v$Grid.value.finalPayment.$model = data.finalPayment ?? null;
};

const onRowEditSave = async (event: any) => {
  const { data, newData, index } = event;

  //console.log(newData);

  if (v$Grid.value.$invalid) {
    editingRows.value = [event.data];
    return;
  }

  const payment = new PaymentInputModel({
    id: data.id,

    finalPayment: v$Grid.value.finalPayment.$model,
  });

  await paymentService.value
    .update(payment)
    .then((response) => {
      if (response.data.success == false) {
        apiErrorStore.setApiErrorMessage(response.data.message);
      } else {
        showSuccess(t("toast.success.update"));

        handleSearch();
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const formatCurrency = (value: number | null) => {
  if (!value) {
    return;
  }
  return value.toLocaleString("fa-IR", { style: "currency", currency: "IRR" });
};

const portals = ref<InstanceType<typeof PortalViewModel>[]>();
const payments = ref<InstanceType<typeof PaymentViewModel>[]>();

const portalService = ref(new PortalService());
const paymentService = ref(new PaymentService());

async function loadPayments(
  searchParams?: InstanceType<typeof PaymentSearchModel>
) {
  try {
    loading.value = true;

    if (v$Search.value.$invalid) {
      loading.value = false;
      return;
    }

    if (!searchParams) {
      searchParams = new PaymentSearchModel({
        portalId: v$Search.value.portal.$model?.id,
        datePersian: v$Search.value.datePersian.$model,
        pageNo: pageNumber.value,
        pageSize: pageSize.value,
        orderKey: "id",
        desc: true,
        isDeleted: false,
      });
    }

    const paymentResponse = await paymentService.value.getAll(searchParams);

    payments.value = paymentResponse.data;
    totalRecords.value = paymentResponse.totalCount;

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
  submitButtonIsLoading.value = true;

  if (v$Search.value.$invalid) {
    submitButtonIsLoading.value = false;
    return;
  }

  await loadPayments(
    new PaymentSearchModel({
      pageSize: pageSize.value,
      pageNo: pageNumber.value,

      portalId: v$Search.value.portal.$model?.id,
      datePersian: v$Search.value.datePersian.$model,

      orderKey: "id",
      desc: true,
      isDeleted: false,
    })
  );

  submitButtonIsLoading.value = false;
};

const calculatePayment = () => {
  calculateButtonIsLoading.value = true;

  if (v$Search.value.$invalid) {
    calculateButtonIsLoading.value = false;
    return;
  }

  calculateButtonIsLoading.value = false;
};

const loadEssentials = async () => {
  try {
    // portals
    portals.value = (
      await portalService.value.getAll(new PortalSearchModel({}))
    ).data;

    if (portals.value.length > 0) {
      v$Search.value.portal.$model = portals.value[0];
    }

    v$Search.value.datePersian.$model = jMoment().format("jYYYY/jMM/01");

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
  <div class="layout-content">
    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card">
            <form
              class="p-fluid"
              autocomplete="off"
              @submit.prevent="handleSearch()"
            >
              <div class="grid formgrid">
                <div class="field col-12 mb-4 md:col-3">
                  <div class="p-float-label">
                    <Dropdown
                      id="portal"
                      v-model="v$Search.portal.$model"
                      :options="portals"
                      option-label="title"
                      :filter="true"
                      :show-clear="true"
                      :class="{ 'p-invalid': v$Search.portal.$invalid }"
                      ><template #empty>
                        {{ t("dropdown.slot.empty") }}
                      </template></Dropdown
                    >

                    <label for="portal">{{ t("portal.title") }}</label>
                  </div>
                </div>
                <div class="field col-12 mb-4 md:col-3">
                  <div class="p-float-label">
                    <PersianDatePicker
                      v-model="v$Search.datePersian.$model"
                      :input-class="
                        v$Search.datePersian.$invalid
                          ? 'p-inputtext p-component p-invalid'
                          : 'p-inputtext p-component '
                      "
                      format="jYYYY/jMM/01"
                      display-format="jMMMM jYYYY"
                      type="year-month"
                      :clearable="true"
                      :auto-submit="true"
                      :popover="true"
                    />
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-2">
                  <Button
                    type="submit"
                    :label="t('button.search')"
                    :loading="submitButtonIsLoading"
                    class="p-button-primary"
                  />
                </div>

                <div class="field col-12 mb-4 md:col-2">
                  <Button
                    type="button"
                    :label="t('button.calculatePayment')"
                    :loading="calculateButtonIsLoading"
                    class="p-button-warning"
                    @click.prevent="calculatePayment"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12">
          <div class="card">
            <DataTable
              v-model:editing-rows="editingRows"
              :value="payments"
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
              >
              </Column>

              <Column
                field="mandatoryShiftCount"
                :header="t('grid.header.mandatoryShiftCount')"
              >
                <template #body="slotProps">
                  {{
                    slotProps.data.mandatoryShiftCount ?? t("general.undefined")
                  }}
                </template>
              </Column>
              <Column
                field="nonMandatoryShiftCount"
                :header="t('grid.header.nonMandatoryShiftCount')"
              >
              </Column>
              <Column
                field="calculatedPayment"
                :header="t('grid.header.calculatedPayment')"
              >
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.calculatedPayment) }}
                </template>
              </Column>

              <Column
                field="finalPayment"
                :header="t('grid.header.finalPayment')"
              >
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.finalPayment) }}
                </template>
                <template #editor>
                  <InputNumber
                    v-model="v$Grid.finalPayment.$model"
                    :min="0"
                    :class="{
                      'p-invalid': v$Grid.finalPayment.$invalid,
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
    </div>

    <Toast position="top-center" group="br" />
    <ConfirmDialog position="top-center" :group="confirmGroup"></ConfirmDialog>
  </div>
</template>
<style lang="scss" scoped></style>
