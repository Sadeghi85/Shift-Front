<script lang="ts" setup>
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import AgentService from "@/services/AgentService";
import ResourceTypeService from "@/services/ResourceTypeService";
import ShiftTabletCrewService from "@/services/ShiftTabletCrewService";
import useApiErrorStore from "@/stores/api-error";
import { useToast } from "primevue/usetoast";
import {
  ShiftTabletCrewViewModel,
  ShiftTabletCrewInputModel,
  ShiftTabletCrewSearchModel,
} from "@/models/ShiftTabletCrewModels";
import { AgentSearchModel, AgentViewModel } from "@/models/AgentModels";
import {
  ResourceTypeSearchModel,
  ResourceTypeViewModel,
} from "@/models/ResourceTypeModels";
import { useGeneralStore } from "@/stores/general";

const generalStore = useGeneralStore();

const props = defineProps({
  shiftTabletCrewId: {
    type: Number,
    required: true,
  },
  shiftTabletId: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["updateIsDone", "insertIsDone", "cuIsCanceled"]);

const apiErrorStore = useApiErrorStore();

// reactive state
const submitted = ref(false);

const agents = ref<AgentViewModel[]>();
const jobs = ref<ResourceTypeViewModel[]>();

const state = reactive({
  agent: ref<AgentViewModel>(),
  job: ref<ResourceTypeViewModel>(),
});

const rules = {
  agent: { required },
  job: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);
const agentService = ref(new AgentService());
const jobService = ref(new ResourceTypeService());
const shiftTabletCrewService = ref(new ShiftTabletCrewService());

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
const onDropdownAgentFilter = async (event: any) => {
  try {
    agents.value = (
      await agentService.value.getAgents({
        pageNo: 0,
        pageSize: generalStore.dropdownItemsCount,
        orderKey: "id",
        id: 0,

        desc: true,
        firstName: event.value,
        lastName: "",
      } as AgentSearchModel)
    ).data;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
};

const onDropdownJobFilter = async (event: any) => {
  try {
    jobs.value = (
      await jobService.value.getResourceTypes({
        pageNo: 0,
        pageSize: generalStore.dropdownItemsCount,
        orderKey: "id",
        id: 0,
        desc: true,
        resourceName: event.value,
      } as ResourceTypeSearchModel)
    ).data;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
};

const handleSubmit = (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  } else {
    if (props.shiftTabletCrewId == 0) {
      //
    } else {
      shiftTabletCrewService.value
        .updateShiftTabletCrew({
          id: props.shiftTabletCrewId,
          agentId: v$.value.agent.$model!.id,
          entranceTime: null,
          exitTime: null,
          shiftTabletId: props.shiftTabletId,
          resourceTypeId: v$.value.job.$model!.id,
        } as ShiftTabletCrewInputModel)
        .then((response) => {
          //console.log(response);
          if (!response.data.success) {
            apiErrorStore.setApiErrorMessage(response.data.failureMessage);
            return;
          }

          emit("updateIsDone");

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
  state.agent = undefined;
  state.job = undefined;

  submitted.value = false;
};

const fillForm = async () => {
  try {
    agents.value = (
      await agentService.value.getAgents({
        pageNo: 0,
        pageSize: generalStore.dropdownItemsCount,
        orderKey: "id",
        id: 0,

        desc: true,
        firstName: "",
        lastName: "",
      } as AgentSearchModel)
    ).data;

    jobs.value = (
      await jobService.value.getResourceTypes({
        pageNo: 0,
        pageSize: generalStore.dropdownItemsCount,
        orderKey: "id",
        id: 0,
        desc: true,
        resourceName: "",
      } as ResourceTypeSearchModel)
    ).data;

    if (props.shiftTabletCrewId == 0) {
      resetForm();
    } else {
      const shiftTabletCrew = (
        await shiftTabletCrewService.value.getShiftTabletCrews({
          pageSize: 1,
          pageNo: 0,
          id: props.shiftTabletCrewId,
          orderKey: "id",
          desc: true,

          agentId: 0,
          agentName: "",
          entranceTime: "",
          exitTime: "",
          fromDate: "",
          isReplaced: null,
          resourceTypeId: 0,
          shifTabletId: 0,
          shiftTitle: "",
          title: "",
          toDate: "",
          isDeleted: false,
        } as ShiftTabletCrewSearchModel)
      ).data[0];

      state.agent = agents.value.find((x) => x.id == shiftTabletCrew.agentId);
      state.job = jobs.value.find(
        (x) => x.id == shiftTabletCrew.resourceTypeId
      );
    }
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.failureMessage);
    } else {
      console.log(error.message);
    }
  }
};

const btnSubmitLabel = computed(() => {
  if (props.shiftTabletCrewId == 0) {
    return t("button.create");
  } else {
    return t("button.update");
  }
});
const btnSubmitClass = computed(() => {
  if (props.shiftTabletCrewId == 0) {
    return "p-button-primary";
  } else {
    return "p-button-warning";
  }
});

watch(
  () => props.shiftTabletCrewId,
  async (shiftLocationId, prevShiftLocationId) => {
    await fillForm();
  },
  { immediate: true }
);

// lifecycle hooks
// onMounted(() => {
// });
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
              <div class="col-12 mb-2 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="agent"
                    v-model="v$.agent.$model"
                    :options="agents"
                    option-label="fullName"
                    :filter="true"
                    :show-clear="true"
                    :class="{
                      'p-invalid': v$.agent.$invalid && submitted,
                    }"
                    @filter="onDropdownAgentFilter"
                    ><template #empty>
                      {{ t("dropdown.slot.empty") }}
                    </template></Dropdown
                  ><label
                    for="agent"
                    :class="{
                      'p-error': v$.agent.$invalid && submitted,
                    }"
                    >{{ t("shiftTabletCrew.agentFullname")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
              <div class="field col-12 mb-2 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="job"
                    v-model="v$.job.$model"
                    :options="jobs"
                    option-label="title"
                    :disabled="true"
                    :class="{
                      'p-invalid': v$.job.$invalid && submitted,
                    }"
                    @filter="onDropdownJobFilter"
                    ><template #empty>
                      {{ t("dropdown.slot.empty") }}
                    </template></Dropdown
                  ><label
                    for="job"
                    :class="{
                      'p-error': v$.job.$invalid && submitted,
                    }"
                    >{{ t("shiftTabletCrew.jobName")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
            </div>
            <div class="grid formgrid">
              <div class="col-12 mb-2 md:col-1">
                <Button
                  class="mt-4"
                  type="submit"
                  :label="btnSubmitLabel"
                  :class="btnSubmitClass"
                ></Button>
              </div>
              <div class="col-12 mb-2 md:col-1">
                <Button
                  class="mt-4 p-button-secondary"
                  type="button"
                  :label="t('button.cancel')"
                  @click.prevent="emit('cuIsCanceled')"
                ></Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <Toast position="top-center" group="br"></Toast>
</template>

<style scoped></style>
