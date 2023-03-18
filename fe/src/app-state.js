import {ref, computed} from 'vue';
export const user = ref();
export const isAdmin = computed(() => user.value && user.value.role === 'Admin');
