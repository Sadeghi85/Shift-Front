<script lang="ts" setup>
const { t } = useI18n();

const items = ref([
  {
    label: t("tabMenu.reports"),
    icon: "pi pi-fw pi-list",
    to: {
      name: "reports",
    },
  },
  {
    label: t("tabMenu.shiftTabletFullCalendar"),
    icon: "pi pi-fw pi-calendar",
    to: {
      name: "shift-tablet-full-calendar",
    },
  },
  {
    label: t("tabMenu.shiftTabletCrewFullCalendar"),
    icon: "pi pi-fw pi-users",
    to: {
      name: "shift-tablet-crew-full-calendar",
    },
  },
]);
</script>

<template>
  <div class="layout-content">
    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card">
            <TabMenu :model="items" />
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
