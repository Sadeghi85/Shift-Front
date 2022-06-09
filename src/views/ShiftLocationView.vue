<template>
  <div>
    <h5>نام لوکیشن</h5>
    <InputText type="text" v-model="locationName" />
  </div>
  <div>
    <h5>شبکه</h5>
    <Dropdown v-model="portal" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ShiftLocation",
  data() {
    return {
      locationName: null,
      portal: null,
    };
  },
});
</script>

<style lang="scss" scoped>
.sizes {
  .p-inputtext {
    display: block;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.field * {
  display: block;
}
</style>
