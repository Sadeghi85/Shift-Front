<script lang="ts" setup>
const blocked = ref(true);

onUnmounted(() => {
  blocked.value = false;
});
</script>

<template>
  <div class="blocked">
    <BlockUI :blocked="blocked" :full-screen="false"></BlockUI>
  </div>
</template>

<style scoped>
.blocked {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
</style>
