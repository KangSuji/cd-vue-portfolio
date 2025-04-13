<template>
  <q-header class="header">
    <span class="material-symbols-outlined logo cursor-pointer" @click="router.push('/')">
      movie_info
    </span>
    <q-btn icon="menu" flat round class="menu_btn" @click="drawer = !drawer" />
  </q-header>

  <q-drawer v-model="drawer" show-if-above :width="200" :breakpoint="400" elevated>
    <q-scroll-area>
      <q-list padding>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="inbox" />
          </q-item-section>

          <q-item-section> Inbox </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>
<script lang="ts" setup>
import router from '@/router';
import { ref } from 'vue';

const drawer = ref(false);
</script>
