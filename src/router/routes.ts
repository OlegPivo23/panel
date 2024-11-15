import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/create', component: () => import('pages/AdminPage.vue') },
      { path: '/users', component: () => import('pages/UsersPage.vue') },
      { path: '/tasks', component: () => import('pages/TasksPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
