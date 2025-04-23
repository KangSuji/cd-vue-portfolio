<template>
  <q-header class="header" elevated>
    <div class="flex items-center">
      <q-icon name="movie" rounded class="header_logo cursor-pointer" @click="router.push('/')" />
      <ul class="header_list">
        <template v-for="menu in menus" :key="menu.code">
          <li clickable @click="router.push({ name: menu.name })">
            <span>{{ menu.label }}</span>
          </li>
        </template>
      </ul>
    </div>
    <div class="header_user_area">USER</div>
  </q-header>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import router from '@/router';

interface MeunList {
  label: string;
  code: string;
  name?: string;
  path: string;
  icon: string;
}
const drawer = ref(false);

const menus = ref<MeunList[]>([
  {
    label: 'Main',
    code: 'main',
    name: 'main',
    path: '/main',
    icon: 'inbox',
  },
  {
    label: 'About',
    code: 'about',
    name: 'about',
    path: '/about',
    icon: 'person',
  },
]);
</script>
