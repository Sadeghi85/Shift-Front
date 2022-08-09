<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";
import { pdate } from "@/helpers/utilities";

const generalStore = useGeneralStore();

const apiErrorStore = useApiErrorStore();

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const router = useRouter();
const route = useRoute();

const shiftTablet = ref<InstanceType<typeof ShiftTabletViewModel>>();

const shiftTabletService = ref(new ShiftTabletService());

const stepItems = ref([
  {
    label: "حضور و غیاب",
    to: {
      name: "shift-tablet-secretary-report",
    },
  },
  {
    label: "گزارش",
    to: {
      name: "shift-tablet-secretary-report-description",
    },
  },
]);

const formObject = ref<{ [key: string]: any }>({});

const nextPage = (event: any) => {
  for (const field in event.formData) {
    formObject.value[field] = event.formData[field];
  }
  router.push(stepItems.value[event.pageIndex + 1].to);
};
const prevPage = (event: any) => {
  router.push(stepItems.value[event.pageIndex - 1].to);
};
const complete = () => {
  //   toast.add({
  //     severity: "success",
  //     summary: "Order submitted",
  //     detail:
  //       "Dear, " +
  //       formObject.value.firstname +
  //       " " +
  //       formObject.value.lastname +
  //       " your order completed.",
  //   });
};

const loadEssentials = async () => {
  try {
    // shiftTablet
    shiftTablet.value = (
      await shiftTabletService.value.getAll(
        new ShiftTabletSearchModel({
          id: +route.params.shiftTabletId,
          orderKey: "id",
          desc: true,
        })
      )
    ).data[0];
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
</script>

<template>
  <div class="layout-content">
    <div class="grid">
      <div class="col-12 md:col-12">
        <Toolbar>
          <template #end>
            <Button
              icon="pi pi-arrow-left"
              class="p-button-rounded p-button-warning"
              @click.prevent="router.push({ name: 'shift-tablet' })"
            />
          </template>
        </Toolbar>
      </div>
    </div>

    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card info">
            <div class="grid">
              <div class="col">
                {{ t("portal.title") }}:
                <strong>{{ shiftTablet?.portalTitle }}</strong>
              </div>
              <div class="col">
                {{ t("shift.title") }}:
                <strong>{{ shiftTablet?.shiftTitle }}</strong>
              </div>
              <div class="col">
                {{ t("shift.shiftDate") }}:
                <strong>{{
                  pdate(shiftTablet?.shiftDate ?? "", "dddd، jYYYY/jMM/jDD")
                }}</strong>
              </div>
              <div class="col">
                {{ t("shift.startTime") }}:
                <strong>{{ shiftTablet?.shiftStartTime }}</strong>
              </div>
              <div class="col">
                {{ t("shift.endTime") }}:
                <strong>{{ shiftTablet?.shiftEndTime }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="col-12 md:col-12">
        <div class="card">
          <Steps :model="stepItems" :readonly="false"> </Steps>
        </div>

        <div class="card">
          <router-view
            v-slot="{ Component }"
            :form-data="formObject"
            @prev-page="prevPage($event)"
            @next-page="nextPage($event)"
            @complete="complete"
          >
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.info {
  background-color: var(--blue-50);
}
</style>
