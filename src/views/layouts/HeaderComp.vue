<template>
  <q-header class="header">
    <span class="material-symbols-outlined logo cursor-pointer" @click="router.push('/')">
      movie_info
    </span>
    <q-btn icon="menu" flat round class="menu_btn" @click="drawer = !drawer" />
  </q-header>

  <q-drawer v-model="drawer" show-if-above :width="200" :breakpoint="400" elevated>
    <q-list padding>
      <template v-for="menu in menus" :key="menu.code">
        <q-item clickable @click="router.push({ name: menu.name })">
          <q-item-section avatar>
            <q-icon :name="menu.icon" />
          </q-item-section>
          <q-item-section> {{ menu.label }} </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-drawer>
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
