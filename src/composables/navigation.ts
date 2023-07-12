import { ref } from 'vue';

const navBarOpen = ref(false)

export const useNavigation = () => {
  const toggleNavBar = () => navBarOpen.value = !navBarOpen.value;
  return { toggleNavBar, navBarOpen }
}

