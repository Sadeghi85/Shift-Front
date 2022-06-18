<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
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

// interface Props {
//   shiftLocationId?: number;
// }
// const props = withDefaults(defineProps<Props>(), {
//   shiftLocationId: 0,
// });
const props = defineProps({
  shiftTabletId: {
    type: Number,
    required: false,
    default: 0,
  },
});
const emit = defineEmits(["reloadGrid"]);

// reactive state
const submitted = ref(false);

const shiftTablets = ref<ShiftTabletViewModel[]>();
const shiftProductionTypes = ref<ShiftProductionTypeViewModel[]>();
const shiftDefinitions = ref<ShiftDefinitionViewModel[]>();

const state = reactive({
  shiftDefinition: ref<ShiftDefinitionViewModel>(),
  shiftProductionType: ref<ShiftProductionTypeViewModel>(),
  shiftDate: ref<string>(),
  shiftWorthPercent: ref<string>(),
});

const rules = {
  shiftDefinition: { required },
  shiftProductionType: { required },
  shiftDate: { required },
  shiftWorthPercent: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);

const shiftTabletService = ref(new ShiftTabletService());
const shiftProductionTypeService = ref(new ShiftProductionTypeService());
const shiftDefinitionService = ref(new ShiftDefinitionService());

const toast = useToast();
const showSuccess = () => {
  toast.add({
    severity: "success",
    summary: t("toast.header.general"),
    detail: t("toast.success.create"),
    life: 3000,
    group: "br",
  });
};

// functions that mutate state and trigger updates

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

const handleSubmit = (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  } else {
    shiftTabletService.value
      .createShiftTablet({
        shiftId: v$.value.shiftDefinition.$model!.id,
        productionTypeId: v$.value.shiftProductionType.$model!.id,
        shiftDate: v$.value.shiftDate.$model,
        shiftWorthPercent: v$.value.shiftWorthPercent.$model,
        shiftTime: "00:00:00",
        id: 0,
      } as ShiftTabletInputModel)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        emit("reloadGrid");
        showSuccess();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const resetForm = () => {
  state.shiftProductionType = undefined;
  state.shiftDate = "";
  state.shiftWorthPercent = "";
  state.shiftDefinition = undefined;

  submitted.value = false;
};

const fillForm = (shiftTabletId: number) => {
  if (shiftTabletId == 0) {
    resetForm();
  } else {
    resetForm();

    const searchParams = {
      pageSize: 1,
      pageNo: 0,
      id: shiftTabletId,
      orderKey: "id",
    } as ShiftTabletSearchModel;

    shiftTabletService.value
      .getShiftTablets(searchParams)
      .then((response) => {
        //console.log(response);
        if (!response.data.success) {
          throw new Error(
            "Failed api call: [" + response.data.failureMessage + "]"
          );
        }

        state.shiftDate = response.data.data[0].shiftDate;
        state.shiftDefinition = shiftDefinitions.value!.find(
          (p) => p.id == response.data.data[0].shiftId
        );
        state.shiftProductionType = shiftProductionTypes.value!.find(
          (p) => p.id == response.data.data[0].productionTypeId
        );
        state.shiftWorthPercent = response.data.data[0].shiftWorthPercent;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

watch(
  () => props.shiftTabletId,
  (shiftTabletId, prevShiftTabletId) => {
    fillForm(shiftTabletId);
  },
  { immediate: true }
);

// lifecycle hooks
onMounted(() => {
  // load shift production types
  loadShiftProductionTypes();
  // load shift definitions
  loadShiftDefinitions();
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
                  <Dropdown
                    id="shiftDefinition"
                    v-model="v$.shiftDefinition.$model"
                    :options="shiftDefinitions"
                    option-label="title"
                    :class="{
                      'p-invalid': v$.shiftDefinition.$invalid && submitted,
                    }"
                  />

                  <label
                    for="shiftDefinition"
                    :class="{
                      'p-error': v$.shiftDefinition.$invalid && submitted,
                    }"
                    >{{ t("shiftDefinition.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>

              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="shiftProductionType"
                    v-model="v$.shiftProductionType.$model"
                    :options="shiftProductionTypes"
                    option-label="title"
                    :class="{
                      'p-invalid': v$.shiftProductionType.$invalid && submitted,
                    }"
                  />

                  <label
                    for="shiftProductionType"
                    :class="{
                      'p-error': v$.shiftProductionType.$invalid && submitted,
                    }"
                    >{{ t("productionType.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>

              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <InputText
                    id="shiftDate"
                    v-model="v$.shiftDate.$model"
                    :class="{
                      'p-invalid': v$.shiftDate.$invalid && submitted,
                    }"
                  />
                  <label
                    for="shiftDate"
                    :class="{
                      'p-error': v$.shiftDate.$invalid && submitted,
                    }"
                    >{{ t("shiftDate.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>

              <div class="field col-12 mb-4 md:col-4">
                <div class="p-float-label">
                  <InputText
                    id="shiftWorthPercent"
                    v-model="v$.shiftWorthPercent.$model"
                    :class="{
                      'p-invalid': v$.shiftWorthPercent.$invalid && submitted,
                    }"
                  />
                  <label
                    for="shiftWorthPercent"
                    :class="{
                      'p-error': v$.shiftWorthPercent.$invalid && submitted,
                    }"
                    >{{ t("shiftWorthPercent.title")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
            </div>

            <div class="grid">
              <div class="col-12 mb-4 md:col-1">
                <Button type="submit" :label="t('button.submit')" class="" />
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
