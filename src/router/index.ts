import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@auth0/auth0-vue';
import HomePage from '@/views/HomePage.vue';

// Extend the meta type
declare module 'vue-router' {
  interface RouteMeta {
    icon?: string;
    title?: string;
    secure?: boolean;
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: {
      icon: 'mdi-home',
      title: 'Home',
    },
  },
  {
    path: '/my-profile',
    name: 'MyProfile',
    component: () => import(/* webpackChunkName: "my-profile" */ '@/views/MyProfilePage.vue'),
    meta: {
      secure: true,
    },
  },
  {
    path: '/my-wife',
    name: 'MyWife',
    component: () => import(/* webpackChunkName: "my-wife" */ '@/views/MyWifePage.vue'),
    meta: {
      icon: 'mdi-heart',
      title: 'My Wife',
    },
  },
  {
    path: '/decision-maker',
    name: 'DecisionMaker',
    component: () =>
      import(/* webpackChunkName: "decision-maker" */ '@/views/DecisionMakerPage.vue'),
    meta: {
      icon: 'mdi-dice-6',
      title: 'Decision Maker',
    },
  },

  {
    path: '/libraries',
    name: 'Libraries',
    component: () => import(/* webpackChunkName: "library-list" */ '@/views/LibraryListPage.vue'),
    meta: {
      icon: 'mdi-library-shelves',
      title: 'Libraries',
      secure: true,
    },
  },
  {
    path: '/library/:libraryId',
    name: 'Library',
    props: true,
    component: () => import(/* webpackChunkName: "library" */ '@/views/LibraryPage.vue'),
    meta: {
      secure: true,
    },
  },
  {
    path: '/book/:bookId',
    name: 'Book',
    props: true,
    component: () => import(/* webpackChunkName: "book" */ '@/views/BookPage.vue'),
    meta: {
      secure: true,
    },
  },
  {
    path: '/security',
    name: 'Security',
    component: () => import(/* webpackChunkName: "security" */ '@/views/SecurityPage.vue'),
    meta: {
      icon: 'mdi-security',
      title: 'Security',
      secure: true,
    },
  },
];

// Add protection guards
routes.forEach(r => {
  if (r.meta?.secure) {
    r.beforeEnter = authGuard;
  }
});

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
