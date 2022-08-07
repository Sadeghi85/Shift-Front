<script lang="ts" setup>
const router = useRouter();
const route = useRoute();

const stepItems = ref([
  {
    label: "حضور و غیاب",
    to: {
      name: "shift-tablet-secretary-report",
    },
  },
  {
    label: "Seat",
    to: {
      name: "shift-tablet-secretary-report-crew",
    },
  },
  {
    label: "Payment",
    to: {
      name: "shift-tablet-secretary-report-crew",
    },
  },
  {
    label: "Confirmation",
    to: {
      name: "shift-tablet-secretary-report-crew",
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
</script>

<template>
  <div class="layout-content">
    <div class="grid">
      <div class="col-12 md:col-12">
        <div class="content-section">
          <div class="grid">
            <div class="col-12 md:col-12">
              <div class="card">
                <Steps :model="stepItems" :readonly="false"> </Steps>
              </div>
            </div>
          </div>
        </div>

        <div class="content-section">
          <div class="grid">
            <div class="col-12 md:col-12">
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
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
