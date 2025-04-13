<template>
  <q-layout :view="'hhh lpr fff'">
    <!-- 헤더 -->
    <HeaderComp />
    <!-- content -->
    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderComp from '@/views/layouts/HeaderComp.vue';
</script>
<style lang="scss" scoped></style>
