<template>
  <div class="q-pa-md max-w-7xl mx-auto">
    <q-layout view="hHh Lpr lFf">
      <q-header elevated class="header">
        <q-toolbar>
          <q-btn
            v-if="isAuthenticated"
            @click="toggleSidebar"
            icon="menu"
            flat
          />
          <q-toolbar-title> My App </q-toolbar-title>
        </q-toolbar>
        <q-btn
          class="items-end"
          v-if="isAuthenticated"
          @click="handleExit"
          label="выход"
          flat
        />
      </q-header>

      <q-drawer side="left" overlay v-model="isSidebarVisible">
        <div ref="sideBar" class="sidebar bg-indigo-8">
          <div class="q-pa-md q-gutter-sm">
            <q-btn
              to="/cabinet"
              class="btn"
              color="indigo-8"
              text-color="white"
              label="Личный кабинет"
            />
            <q-btn
              to="/create"
              class="btn"
              color="indigo-8"
              text-color="white"
              label="Создать пользователя"
            />
            <q-btn
              to="/users"
              class="btn"
              color="indigo-8"
              text-color="white"
              label="Пользователи"
            />
            <q-btn
              to="/tasks"
              class="btn"
              color="indigo-8"
              text-color="white"
              label="Задачи"
            />
          </div>
        </div>
      </q-drawer>

      <q-page-container>
        <RouterView></RouterView>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/userStore';
import cookie from 'cookiejs';

const userStore = useUserStore();
const router = useRouter();
const isSidebarVisible = ref<boolean>(false);
const sideBar = ref<HTMLElement | null>(null);

const isAuthenticated = computed(() => userStore.isAuthenticated);

function toggleSidebar() {
  isSidebarVisible.value = !isSidebarVisible.value;
}

function handleExit() {
  cookie.remove('token');
  userStore.token = '';
  userStore.user = null;
  router.push('/');
}

onClickOutside(sideBar, () => {
  isSidebarVisible.value = false;
});

onMounted(() => {
  userStore.autoLogin();
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.sidebar {
  height: 100vh;
}
.btn {
  width: 100%;
}
.btn-exit {
  display: flex;
  justify-content: flex-end;
}
</style>
