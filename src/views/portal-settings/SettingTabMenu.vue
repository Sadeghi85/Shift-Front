<script lang="ts" setup>
import useApiErrorStore from "@/stores/api-error";
import { useGeneralStore } from "@/stores/general";

const generalStore = useGeneralStore();

const apiErrorStore = useApiErrorStore();

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const router = useRouter();
const route = useRoute();

const shiftTablet = ref<InstanceType<typeof ShiftTabletViewModel>>();
const shiftTabletService = ref(new ShiftTabletService());

const tabMenuItems = ref([
  {
    label: t("tabMenu.locations"),
    icon: "pi pi-fw pi-cog",
    to: {
      name: "portal-settings",
    },
  },
  {
    label: t("tabMenu.mandatoryShiftCount"),
    icon: "pi pi-fw pi-cog",
    to: {
      name: "portal-settings-mandatory-shift-count",
    },
  },
  // {
  //   label: t("tabMenu.nonMandatoryShiftWage"),
  //   icon: "pi pi-fw pi-cog",
  //   to: {
  //     name: "non-mandatory-shift-wage",
  //   },
  // },
]);
</script>

<template>
  <div class="layout-content">
    <!-- <div class="grid">
      <div class="col-12 md:col-12">
        <Toolbar>
          <template #end>
            <Button
              icon="pi pi-file-pdf"
              class="p-button-rounded p-button-success ml-2"
              @click.prevent="getSecretaryReport"
            />

            <Button
              icon="pi pi-arrow-left"
              class="p-button-rounded p-button-warning"
              @click.prevent="router.push({ name: 'shift-tablet' })"
            />
          </template>
        </Toolbar>
      </div>
    </div> -->

    <div class="grid">
      <div class="col-12 md:col-12">
        <div class="card">
          <TabMenu :model="tabMenuItems" />
        </div>

        <div class="card">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
