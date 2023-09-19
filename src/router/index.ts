import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@auth0/auth0-vue';
import HomePage from '@/views/HomePage.vue';

// Extend the meta type
declare module 'vue-router' {
  interface RouteMeta {
    icon?: string;
    title?: string;
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
    component: () => import(/* webpackChunkName: "libraries" */ '@/views/LibrariesPage.vue'),
    meta: {
      icon: 'mdi-library-shelves',
      title: 'Libraries',
    },
  },
  {
    path: '/libraries/:libraryId',
    name: 'Library',
    props: true,
    component: () => import(/* webpackChunkName: "library" */ '@/views/LibraryPage.vue'),
  },
  {
    path: '/book/:bookId',
    name: 'Book',
    props: true,
    component: () => import(/* webpackChunkName: "book" */ '@/views/BookPage.vue'),
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: () => import(/* webpackChunkName: "recipes" */ '@/views/RecipesPage.vue'),
    meta: {
      title: 'Recipes',
      icon: 'mdi-chef-hat',
    },
  },
  {
    path: '/recipes/:recipeId',
    name: 'Recipe',
    props: true,
    component: () => import(/* webpackChunkName: "recipe" */ '@/views/RecipePage.vue'),
  },
  {
    path: '/todos',
    name: 'Todos',
    component: () => import(/* webpackChunkName: "todos" */ '@/views/TodosPage.vue'),
    meta: {
      title: 'Todos',
      icon: 'mdi-format-list-checks',
    },
  },
  {
    path: '/security',
    name: 'Security',
    component: () => import(/* webpackChunkName: "security" */ '@/views/SecurityPage.vue'),
    meta: {
      icon: 'mdi-security',
      title: 'Security',
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(authGuard);

export default router;
