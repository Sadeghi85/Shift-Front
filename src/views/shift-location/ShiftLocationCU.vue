<script lang="ts" setup>
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import PortalService from "@/services/PortalService";
import ShiftLocationService from "@/services/ShiftLocationService";
import { usePortalStore } from "@/stores/portal";
import { PortalViewModel, PortalSearchModel } from "@/models/PortalModels";
import { useToast } from "primevue/usetoast";
import {
  ShiftLocationViewModel,
  ShiftLocationInputModel,
  ShiftLocationSearchModel,
} from "@/models/ShiftLocationModels";

// interface Props {
//   shiftLocationId?: number;
// }
// const props = withDefaults(defineProps<Props>(), {
//   shiftLocationId: 0,
// });
const props = defineProps({
  shiftLocationId: {
    type: Number,
    required: false,
    default: 0,
  },
});
const emit = defineEmits(["reloadGrid", "closeForm"]);

// reactive state
const submitted = ref(false);

const portals = ref<PortalViewModel[]>();

const state = reactive({
  locationName: "",
  //portal: undefined as PortalViewModel | undefined,
  portal: ref<PortalViewModel>(),
});

const rules = {
  locationName: { required },
  portal: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);
const portalService = ref(new PortalService());
const shiftLocationService = ref(new ShiftLocationService());
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
    if (props.shiftLocationId == 0) {
      shiftLocationService.value
        .createShiftLocation({
          id: 0,
          title: v$.value.locationName.$model,
          portalId: v$.value.portal.$model!.id,
        } as ShiftLocationInputModel)
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
      shiftLocationService.value
        .updateShiftLocation({
          id: props.shiftLocationId,
          title: v$.value.locationName.$model,
          portalId: v$.value.portal.$model!.id,
        } as ShiftLocationInputModel)
        .then((response) => {
          //console.log(response);
          if (!response.data.success) {
            throw new Error(
              "Failed api call: [" + response.data.failureMessage + "]"
            );
          }

          //handleSearch();
          emit("closeForm");
          emit("reloadGrid");

          //emit('eventB', params)

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
  state.locationName = "";
  state.portal = undefined;

  submitted.value = false;
};

const fillForm = () => {
  if (props.shiftLocationId == 0) {
    resetForm();
  } else {
    const searchParams = {
      pageSize: 1,
      pageNo: 0,
      id: props.shiftLocationId,
      orderKey: "id",
    } as ShiftLocationSearchModel;

    shiftLocationService.value
      .getShiftLocations(searchParams)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        state.locationName = response.data.data[0].title;
        state.portal = portals.value!.find(
          (p) => p.id == response.data.data[0].portalId
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
  if (props.shiftLocationId == 0) {
    return t("button.create");
  } else {
    return t("button.update");
  }
});
const btnSubmitClass = computed(() => {
  if (props.shiftLocationId == 0) {
    return "p-button-primary";
  } else {
    return "p-button-warning";
  }
});

watch(
  () => props.shiftLocationId,
  (shiftLocationId, prevShiftLocationId) => {
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
              <div class="col-12 mb-2 md:col-4 md:mb-0">
                <div class="p-float-label">
                  <InputText
                    id="locationName"
                    v-model="v$.locationName.$model"
                    :class="{
                      'p-invalid': v$.locationName.$invalid && submitted,
                    }"
                  />
                  <label
                    for="locationName"
                    :class="{
                      'p-error': v$.locationName.$invalid && submitted,
                    }"
                    >{{ t("location.name")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
              <div class="field col-12 mb-2 md:col-4 md:mb-0">
                <div class="p-float-label">
                  <Dropdown
                    id="portal"
                    v-model="v$.portal.$model"
                    :options="portals"
                    option-label="title"
                    :class="{
                      'p-invalid': v$.portal.$invalid && submitted,
                    }"
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
            </div>

            <div class="grid formgrid">
              <div class="col-12 mb-2 md:col-1 md:mb-0">
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
