<script lang="ts" setup>
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import PortalService from "@/services/PortalService";
import ShiftDefinitionService from "@/services/ShiftDefinitionService";
import { usePortalStore } from "@/stores/portal";
import { PortalViewModel, PortalSearchModel } from "@/models/PortalModels";
import { useToast } from "primevue/usetoast";
import {
  ShiftDefinitionViewModel,
  ShiftDefinitionInputModel,
  ShiftDefinitionSearchModel,
} from "@/models/ShiftDefinitionModels";
import { ShiftTypeViewModel } from "@/models/ShiftTypeModels";

// interface Props {
//   shiftLocationId?: number;
// }
// const props = withDefaults(defineProps<Props>(), {
//   shiftLocationId: 0,
// });
const props = defineProps({
  shiftDefinitionId: {
    type: Number,
    required: false,
    default: 0,
  },
});
const emit = defineEmits(["reloadGrid", "closeForm"]);

// reactive state
const { t } = useI18n();
const submitted = ref(false);

const portals = ref<PortalViewModel[]>();
const shiftTypes = ref<ShiftTypeViewModel[]>([
  { id: 1, title: t("shift.type.regie") },
  { id: 2, title: t("shift.type.coordinator") },
]);

const state = reactive({
  shiftTitle: "",
  portal: ref<PortalViewModel>(),
  startTime: "",
  endTime: "",
  shiftType: ref<ShiftTypeViewModel>(),
});

const rules = {
  shiftTitle: { required },
  portal: { required },
  startTime: { required },
  endTime: { required },
  shiftType: { required },
};

////////
const v$ = useVuelidate(rules, state);
const portalService = ref(new PortalService());
const shiftDefinitionService = ref(new ShiftDefinitionService());
const portalStore = usePortalStore();

const toast = useToast();
const showSuccess = (detail: string) => {
  toast.add({
    severity: "success",
    summary: t("toast.header.general"),
    detail: detail,
    life: 3000,
    group: "br",
  });
};

// functions that mutate state and trigger updates
const handleSubmit = (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  } else {
    if (props.shiftDefinitionId == 0) {
      shiftDefinitionService.value
        .createShiftDefinition({
          title: v$.value.shiftTitle.$model,
          portalId: v$.value.portal.$model!.id,
          startTime: v$.value.startTime.$model,
          endTime: v$.value.endTime.$model,
          shiftType: v$.value.shiftType.$model!.id,
        } as ShiftDefinitionInputModel)
        .then((response) => {
          //console.log(response);
          if (!response.data.success) {
            throw new Error(
              "Failed api call: [" + response.data.failureMessage + "]"
            );
          }

          //handleSearch();
          emit("reloadGrid");
          //emit('eventB', params)

          showSuccess(t("toast.success.create"));
          resetForm();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      shiftDefinitionService.value
        .updateShiftDefinition({
          id: props.shiftDefinitionId,
          title: v$.value.shiftTitle.$model,
          portalId: v$.value.portal.$model!.id,
          startTime: v$.value.startTime.$model,
          endTime: v$.value.endTime.$model,
          shiftType: v$.value.shiftType.$model!.id,
        } as ShiftDefinitionInputModel)
        .then((response) => {
          //console.log(response);
          if (!response.data.success) {
            throw new Error(
              "Failed api call: [" + response.data.failureMessage + "]"
            );
          }

          emit("closeForm");
          emit("reloadGrid");

          showSuccess(t("toast.success.update"));
          resetForm();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};

const resetForm = () => {
  state.shiftTitle = "";
  state.portal = undefined;
  state.startTime = "";
  state.endTime = "";
  state.shiftType = undefined;

  submitted.value = false;
};

const fillForm = () => {
  if (props.shiftDefinitionId == 0) {
    resetForm();
  } else {
    const searchParams = {
      pageSize: 1,
      pageNo: 0,
      id: props.shiftDefinitionId,
      orderKey: "id",
    } as ShiftDefinitionSearchModel;

    shiftDefinitionService.value
      .getShiftDefinitions(searchParams)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        state.shiftTitle = response.data.data[0].title;
        state.portal = portals.value!.find(
          (p) => p.id == response.data.data[0].portalId
        );
        state.startTime = response.data.data[0].startTime;
        state.endTime = response.data.data[0].endTime;
        state.shiftType = shiftTypes.value!.find(
          (s) => s.title == response.data.data[0].shiftTypeTitle
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

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

const btnSubmitLabel = computed(() => {
  if (props.shiftDefinitionId == 0) {
    return t("button.create");
  } else {
    return t("button.update");
  }
});
const btnSubmitClass = computed(() => {
  if (props.shiftDefinitionId == 0) {
    return "p-button-primary";
  } else {
    return "p-button-warning";
  }
});

watch(
  () => props.shiftDefinitionId,
  (shiftDefinitionId, prevShiftDefinitionId) => {
    fillForm();
  },
  { immediate: true }
);

// lifecycle hooks
onMounted(() => {
  // portals
  loadPortals();
});
</script>

<template>
  <div class="content-section">
    <div class="grid">
      <div class="col-12 md:col-12 p-fluid">
        <div class="card">
          <form
            class="p-fluid"
            autocomplete="off"
            @submit.prevent="handleSubmit(!v$.$invalid)"
          >
            <div class="grid formgrid">
              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <InputText
                    id="shiftTitle"
                    v-model="v$.shiftTitle.$model"
                    :class="{
                      'p-invalid': v$.shiftTitle.$invalid && submitted,
                    }"
                  />
                  <label
                    for="shiftTitle"
                    :class="{
                      'p-error': v$.shiftTitle.$invalid && submitted,
                    }"
                    >{{ t("shift.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="portal"
                    v-model="v$.portal.$model"
                    :options="portals"
                    option-label="title"
                    :class="{ 'p-invalid': v$.portal.$invalid && submitted }"
                  />

                  <label
                    for="portal"
                    :class="{
                      'p-error': v$.portal.$invalid && submitted,
                    }"
                    >{{ t("portal.name")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="shiftType"
                    v-model="v$.shiftType.$model"
                    :options="shiftTypes"
                    option-label="title"
                    :class="{
                      'p-invalid': v$.shiftType.$invalid && submitted,
                    }"
                  />

                  <label
                    for="shiftType"
                    :class="{
                      'p-error': v$.shiftType.$invalid && submitted,
                    }"
                    >{{ t("shiftType.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>

              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <InputText
                    id="startTime"
                    v-model="v$.startTime.$model"
                    :class="{
                      'p-invalid': v$.startTime.$invalid && submitted,
                    }"
                  />
                  <label
                    for="startTime"
                    :class="{
                      'p-error': v$.startTime.$invalid && submitted,
                    }"
                    >{{ t("shift.startTime")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <InputText
                    id="endTime"
                    v-model="v$.endTime.$model"
                    :class="{
                      'p-invalid': v$.endTime.$invalid && submitted,
                    }"
                  />
                  <label
                    for="endTime"
                    :class="{
                      'p-error': v$.endTime.$invalid && submitted,
                    }"
                    >{{ t("shift.endTime")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
            </div>

            <div class="grid">
              <div class="col-12 mb-4 md:col-1">
                <Button
                  type="submit"
                  :label="btnSubmitLabel"
                  class="mt-4"
                  :class="btnSubmitClass"
                />
              </div>
              <div class="col-12 mb-2 md:col-1 md:mb-0">
                <Button
                  type="button"
                  :label="t('button.cancel')"
                  class="mt-4 p-button-secondary"
                  @click="emit('closeForm')"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <Toast position="top-center" group="br" />
</template>

<style scoped></style>
