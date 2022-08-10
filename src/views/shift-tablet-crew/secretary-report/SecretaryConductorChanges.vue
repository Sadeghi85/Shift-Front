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

const submitButtonIsLoading = ref(false);

const showSuccess = (detail: string) => {
  toast.add({
    severity: "success",
    summary: t("toast.header.general"),
    detail: detail,
    life: 3000,
    group: "br",
  });
};

const shiftTabletConductorChangeService = ref(
  new ShiftTabletConductorChangeService()
);

const shiftTabletConductorChanges =
  ref<InstanceType<typeof ShiftTabletConductorChangeViewModel>[]>();
const oldProgramTitle = ref("");
const newProgramTitle = ref("");
const description = ref("");

const editingRows = ref<any[]>([]);
const selectedRows = ref<any[]>([]);

const edittedRow =
  ref<InstanceType<typeof ShiftTabletConductorChangeViewModel>>();

const onRowEditInit = async (event: any) => {
  const { data, newData, index } = event;

  edittedRow.value = data;
};

const onRowEditSave = async (event: any) => {
  const { data, newData, index } = event;

  console.log(newData);

  if (!(oldProgramTitle.value && newProgramTitle.value)) {
    editingRows.value = [...editingRows.value, event.data];
    return;
  }

  if (data.id == 0) {
    await shiftTabletConductorChangeService.value
      .create(
        new ShiftTabletConductorChangeInputModel({
          id: 0,

          shiftTabletId: +route.params.shiftTabletId,
          roleTypeId: RoleTypes.Secretary,

          oldProgramTitle: oldProgramTitle.value,
          newProgramTitle: newProgramTitle.value,
          description: description.value,
        })
      )
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
    await shiftTabletConductorChangeService.value
      .update(
        new ShiftTabletConductorChangeInputModel({
          id: data.id,

          shiftTabletId: data.shiftTabletId,
          roleTypeId: data.roleTypeId,

          oldProgramTitle: oldProgramTitle.value,
          newProgramTitle: newProgramTitle.value,
          description: description.value,
        })
      )
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
    shiftTabletConductorChanges.value!.filter((item) => item.id == 0).length > 0
  ) {
    return;
  }

  shiftTabletConductorChanges.value?.unshift(
    new ShiftTabletConductorChangeViewModel({
      id: 0,
      oldProgramTitle: "",
      newProgramTitle: "",
      description: "",
    })
  );
}

async function confirmDeleteSelected() {
  confirm.require({
    message: t("confirm.message.delete"),
    header: t("confirm.header.confirmation"),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "mr-4 p-button-danger",
    rejectClass: "p-button-secondary",
    acceptLabel: t("confirm.button.accept"),
    rejectLabel: t("confirm.button.reject"),
    defaultFocus: "reject",
    accept: async () => {
      const selectedIds = selectedRows.value
        .filter((row) => row.id != 0)
        .map((row) => row.id);

      if (selectedIds.length == 0) {
        handleSearch();
        return;
      } else {
        await shiftTabletConductorChangeService.value
          .deleteMultiple(selectedIds)
          .then((response) => {
            //console.log(response);
            if (!response.data.success) {
              apiErrorStore.setApiErrorMessage(response.data.message);
              handleSearch();
              return;
            }

            handleSearch();
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

async function loadShiftTabletConductorChanges(
  searchParams?: InstanceType<typeof ShiftTabletConductorChangeSearchModel>
) {
  try {
    loading.value = true;

    if (!searchParams) {
      searchParams = new ShiftTabletConductorChangeSearchModel({
        pageSize: 2147483647, // Int32.MaxValue
        pageNo: 0,
        orderKey: "id",
        desc: true,

        shiftTabletId: +route.params.shiftTabletId,
        roleTypeId: RoleTypes.Secretary,
      });
    }

    const shiftTabletConductorChangeResponse =
      await shiftTabletConductorChangeService.value.getAll(searchParams);

    shiftTabletConductorChanges.value = shiftTabletConductorChangeResponse.data;
    totalRecords.value = shiftTabletConductorChangeResponse.totalCount;

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
  await loadShiftTabletConductorChanges(
    new ShiftTabletConductorChangeSearchModel({
      shiftTabletId: +route.params.shiftTabletId,
      pageSize: pageSize.value,
      pageNo: pageNumber.value,
      orderKey: "id",
      desc: true,

      roleTypeId: RoleTypes.Secretary,
    })
  );
};

const loadEssentials = async () => {
  try {
    // shiftTabletConductorChanges
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
            :value="shiftTabletConductorChanges"
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

            <Column
              field="oldProgramTitle"
              :header="t('grid.header.oldProgramTitle')"
            >
              <template #editor>
                <InputText v-model="oldProgramTitle" />
              </template>
            </Column>
            <Column
              field="newProgramTitle"
              :header="t('grid.header.newProgramTitle')"
            >
              <template #editor>
                <InputText v-model="newProgramTitle" />
              </template>
            </Column>

            <Column field="description" :header="t('grid.header.description')">
              <template #editor>
                <InputText v-model="description" />
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
