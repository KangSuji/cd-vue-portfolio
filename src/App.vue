<template>
  <q-layout :view="'Hhh lpr fff'">
    <HeaderComp />
    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderComp from '@/views/layouts/HeaderComp.vue';
import { onMounted } from 'vue';
import { loadTheme } from './utils/themeUtils';

onMounted(async () => {
  await loadTheme();
});
</script>
<style lang="scss" scoped></style>
