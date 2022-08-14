<script lang="ts" setup>
import RoleTypes from "@/enums/RoleType";
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";

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

const shiftTabletReviewProblemService = ref(
  new ShiftTabletReviewProblemService()
);

const shiftTabletReviewProblems =
  ref<InstanceType<typeof ShiftTabletReviewProblemViewModel>[]>();

const state = reactive({
  fileNumber: "",
  programTitle: "",
  clacketNo: 0,
  problemDescription: "",
  reviewerCode: "",
  description: "",
});

const rules = {
  fileNumber: { required },
  programTitle: { required },
  clacketNo: { required, numeric },
  problemDescription: { required },
  reviewerCode: { required },
  description: {},
};

const v$ = useVuelidate(rules, state);

const editingRows = ref<any[]>([]);
const selectedRows = ref<any[]>([]);

const onRowEditInit = async (event: any) => {
  const { data, newData, index } = event;

  editingRows.value = [data];

  v$.value.fileNumber.$model = data.fileNumber ?? "";
  v$.value.programTitle.$model = data.programTitle ?? "";
  v$.value.problemDescription.$model = data.problemDescription ?? "";
  v$.value.clacketNo.$model = data.clacketNo ?? 0;
  v$.value.reviewerCode.$model = data.reviewerCode ?? "";
  v$.value.description.$model = data.description ?? "";
};

const onRowEditSave = async (event: any) => {
  const { data, newData, index } = event;

  console.log(newData);

  if (v$.value.$invalid) {
    editingRows.value = [event.data];
    return;
  }

  const shiftTabletReviewProblem = new ShiftTabletReviewProblemInputModel({
    id: data.id,

    shiftTabletId: +route.params.shiftTabletId,
    roleTypeId: RoleTypes.PakhshOverseer,

    fileNumber: v$.value.fileNumber.$model,
    clacketNo: v$.value.clacketNo.$model,
    programTitle: v$.value.programTitle.$model,
    problemDescription: v$.value.problemDescription.$model,
    reviewerCode: v$.value.reviewerCode.$model,
    description: v$.value.description.$model,
  });

  if (data.id == 0) {
    await shiftTabletReviewProblemService.value
      .create(shiftTabletReviewProblem)
      .then((response) => {
        if (response.data.success == false) {
          apiErrorStore.setApiErrorMessage(response.data.message);
        } else {
          showSuccess(t("toast.success.create"));

          handleSearch();
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  } else {
    await shiftTabletReviewProblemService.value
      .update(shiftTabletReviewProblem)
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
  }
};

function openNew() {
  if (
    shiftTabletReviewProblems.value!.filter((item) => item.id == 0).length > 0
  ) {
    return;
  }

  // reseting the state
  Object.entries(state).forEach(([key, value]) => {
    type mainKey = keyof typeof v$.value;
    const field = key as mainKey;
    const fieldValue = v$.value[field] as any;
    fieldValue.$model = "";
  });

  shiftTabletReviewProblems.value?.unshift(
    new ShiftTabletReviewProblemViewModel({
      id: 0,
    })
  );

  editingRows.value = [shiftTabletReviewProblems.value![0]];
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
        shiftTabletReviewProblemService.value
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

async function loadShiftTabletReviewProblems(
  searchParams?: InstanceType<typeof ShiftTabletReviewProblemSearchModel>
) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = new ShiftTabletReviewProblemSearchModel({
        pageSize: 2147483647, // Int32.MaxValue
        pageNo: 0,
        orderKey: "id",
        desc: true,

        shiftTabletId: +route.params.shiftTabletId,
        roleTypeId: RoleTypes.PakhshOverseer,
      });
    }

    const shiftTabletReviewProblemResponse =
      await shiftTabletReviewProblemService.value.getAll(searchParams);

    shiftTabletReviewProblems.value = shiftTabletReviewProblemResponse.data;
    totalRecords.value = shiftTabletReviewProblemResponse.totalCount;

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
  await loadShiftTabletReviewProblems(
    new ShiftTabletReviewProblemSearchModel({
      shiftTabletId: +route.params.shiftTabletId,
      pageSize: 2147483647, // Int32.MaxValue
      pageNo: 0,
      orderKey: "id",
      desc: true,

      roleTypeId: RoleTypes.PakhshOverseer,
    })
  );
};

const loadEssentials = async () => {
  try {
    // shiftTabletReviewProblems
    await handleSearch();
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
};

watch(
  () => route.params.shiftTabletId,
  async (shiftTabletId, prevShiftTabletId) => {
    if (shiftTabletId) {
      await loadEssentials();
    }
  },
  { immediate: true }
);

// lifecycle hooks
// onMounted(async () => {
// });
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
            :value="shiftTabletReviewProblems"
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

            <Column field="fileNumber" :header="t('grid.header.fileNumber')">
              <template #editor>
                <InputText
                  v-model="v$.fileNumber.$model"
                  :class="{
                    'p-invalid': v$.fileNumber.$invalid,
                  }"
                />
              </template>
            </Column>
            <Column
              field="programTitle"
              :header="t('grid.header.programTitle')"
            >
              <template #editor>
                <InputText
                  v-model="v$.programTitle.$model"
                  :class="{
                    'p-invalid': v$.programTitle.$invalid,
                  }"
                />
              </template>
            </Column>

            <Column field="clacketNo" :header="t('grid.header.clacketNo')">
              <template #editor>
                <InputNumber
                  v-model="v$.clacketNo.$model"
                  :class="{
                    'p-invalid': v$.clacketNo.$invalid,
                  }"
                />
              </template>
            </Column>
            <Column
              field="problemDescription"
              :header="t('grid.header.problemDescription')"
            >
              <template #body="slotProps">
                <pre>{{ slotProps.data.problemDescription }}</pre>
              </template>
              <template #editor>
                <Textarea
                  v-model="v$.problemDescription.$model"
                  :class="{
                    'p-invalid': v$.problemDescription.$invalid,
                  }"
                  :auto-resize="true"
                />
              </template>
            </Column>
            <Column
              field="reviewerCode"
              :header="t('grid.header.reviewerCode')"
            >
              <template #editor>
                <InputText
                  v-model="v$.reviewerCode.$model"
                  :class="{
                    'p-invalid': v$.reviewerCode.$invalid,
                  }"
                />
              </template>
            </Column>

            <Column field="description" :header="t('grid.header.description')">
              <template #editor>
                <InputText
                  v-model="v$.description.$model"
                  :class="{
                    'p-invalid': v$.description.$invalid,
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
