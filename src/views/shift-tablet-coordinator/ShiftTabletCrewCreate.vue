<script lang="ts" setup>
import RoleTypes from "@/enums/RoleType";
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";

const generalStore = useGeneralStore();

const props = defineProps({
  shiftTabletCrewId: {
    type: Number,
    required: false,
    default: 0,
  },
  shiftTabletId: {
    type: Number,
    required: true,
  },
  shiftTabletCrewIsReplacement: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const emit = defineEmits(["updateIsDone", "insertIsDone", "cuIsCanceled"]);

const apiErrorStore = useApiErrorStore();

// reactive state
const submitted = ref(false);
const submitButtonIsLoading = ref(false);

const agents = ref<InstanceType<typeof AgentViewModel>[]>();
const jobs = ref<InstanceType<typeof ShiftDefinitionTemplateViewModel>[]>();

const state = reactive({
  agent: ref<InstanceType<typeof AgentViewModel>>(),
  job: ref<InstanceType<typeof ShiftDefinitionTemplateViewModel>>(),
});

const rules = {
  agent: { required },
  job: { required },
};

////////
const { t } = useI18n();
const v$ = useVuelidate(rules, state);
const agentService = ref(new AgentService());
const jobService = ref(new JobService());
const shiftTabletCrewService = ref(new ShiftTabletCrewService());
const shiftTabletService = ref(new ShiftTabletService());
const shiftDefinitionTemplateService = ref(
  new ShiftDefinitionTemplateService()
);

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
      await agentService.value.getAll(
        new AgentSearchModel({
          pageSize: generalStore.dropdownItemsCount,
          orderKey: "id",
          desc: true,
          name: event.value,
          jobId: state.job?.jobId,
        })
      )
    ).data;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
};

const onDropdownJobChange = async (event: any) => {
  try {
    console.log(event.value);
    agents.value = (
      await agentService.value.getAll(
        new AgentSearchModel({
          jobId: event.value.jobId,
          pageSize: generalStore.dropdownItemsCount,
          orderKey: "id",
          desc: true,
        })
      )
    ).data;
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
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
    submitButtonIsLoading.value = true;

    if (props.shiftTabletCrewId == 0) {
      shiftTabletCrewService.value
        .create(
          new ShiftTabletCrewInputModel({
            agentId: v$.value.agent.$model?.id,
            shiftTabletId: props.shiftTabletId,
            jobId: v$.value.job.$model?.jobId,
            roleTypeId: RoleTypes.Coordinator,
          })
        )
        .then((response) => {
          submitButtonIsLoading.value = false;

          //console.log(response);
          if (!response.data.success) {
            apiErrorStore.setApiErrorMessage(response.data.message);
            return;
          }

          emit("insertIsDone");

          showSuccess(t("toast.success.create"));
          resetForm();
        })
        .catch((error) => {
          submitButtonIsLoading.value = false;

          console.log(error);
        });
    } else {
      //
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
    const shiftDefititionId = (
      await shiftTabletService.value.getAll(
        new ShiftTabletSearchModel({
          id: props.shiftTabletId,
        })
      )
    ).data[0].shiftId;

    jobs.value = (
      await shiftDefinitionTemplateService.value.getAll(
        new ShiftDefinitionTemplateSearchModel({
          pageSize: 2147483647, // Int32.MaxValue
          shiftId: shiftDefititionId,
          orderKey: "id",
          desc: true,
        })
      )
    ).data;

    agents.value = (
      await agentService.value.getAll(
        new AgentSearchModel({
          pageSize: generalStore.dropdownItemsCount,
          orderKey: "id",
          desc: true,
        })
      )
    ).data;

    if (props.shiftTabletCrewId == 0) {
      resetForm();
    } else {
      //
    }
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
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
              <div class="field col-12 mb-2 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="job"
                    v-model="v$.job.$model"
                    :options="jobs"
                    option-label="jobTitle"
                    :filter="true"
                    :show-clear="true"
                    :class="{
                      'p-invalid': v$.job.$invalid && submitted,
                    }"
                    @change="onDropdownJobChange"
                  >
                    <template #empty>
                      {{ t("dropdown.crew.slot.empty") }}
                    </template> </Dropdown
                  ><label
                    for="job"
                    :class="{
                      'p-error': v$.job.$invalid && submitted,
                    }"
                    >{{ t("shiftTabletCrew.jobTitle")
                    }}<span :style="{ color: 'var(--red-500)' }">*</span></label
                  >
                </div>
              </div>
              <div class="col-12 mb-2 md:col-4">
                <div class="p-float-label">
                  <Dropdown
                    id="agent"
                    v-model="v$.agent.$model"
                    :options="agents"
                    option-label="fullname"
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
            </div>
            <div class="grid align-center">
              <div class="col-12 mb-2 md:col-1">
                <Button
                  class="mt-4"
                  type="submit"
                  :loading="submitButtonIsLoading"
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
