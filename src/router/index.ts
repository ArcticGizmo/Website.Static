import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

// Extend the meta type
declare module 'vue-router' {
  interface RouteMeta {
    icon: string,
    title: string,
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: 'Home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/HomePage.vue'),
    meta: {
      icon: 'mdi-home',
      title: 'Home'
    },
  },
  {
    path: '/my-wife',
    name: 'MyWife',
    component: () => import(/* webpackChunkName: "my-wife" */ '@/views/MyWifePage.vue'),
    meta: {
      icon: 'mdi-heart',
      title: 'My Wife'
    },
  },
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
