<template>
  <div class="fr h-100vh v-100vw" style="background-color: #121212">
    <div class="fc ovf-y-s hide-scroll-bar sidebar">
      <div class="fr ai-c fg-1 px-1 py-2" style="height: 50px;">
        {{user.username}}
      </div>
      <div v-for="(item, i) in sidebarItems"
           class="fr ai-c px-2 py-2 clickable"
           :style="getSidebarItemStyle(i)"
           @click="selectSidebarItem(i)">
        <icon class="item-icon">{{ item.icon }}</icon>
        <span class="item-text">{{ item.title }}</span>
      </div>
      <spacer/>
      <div class="fr ai-c px-2 py-2 clickable" @click="userAPI.signOut">
        <icon class="item-icon">fas fa-sign-out-alt@20:#aaa</icon>
        <span class="item-text">Sign out</span>
      </div>
    </div>
    <div class="ovf-h content">
      <SelectedComponent/>
    </div>
  </div>
</template>
<script setup lang="tsx">
import {ref, computed} from 'vue';
import Icon from '@/components/UiLib/Icon.vue';
import {user} from '@/app-state.js';
import {userAPI} from '@/api/index.js';
import Spacer from "../UiLib/Spacer.vue";

interface ISideBarItem {
  title: string;
  icon: string;
  component: any
}
interface Props {
  sidebarItems: [ISideBarItem]
}

const props = defineProps<Props>()
const selectedSidebarItemIdx = ref(0)
const SelectedComponent = computed(() => props.sidebarItems[selectedSidebarItemIdx.value].component)
function getSidebarItemStyle(i) {
  return {
    cursor: 'pointer',
    margin: '4px 0px 4px 4px',
    borderRadius: '10px 0px 0px 10px',
    color: '#fff',
    fontSize: '14px',
    background: (selectedSidebarItemIdx.value === i) ? '#303741' : 'transparent'}
}
function selectSidebarItem(i) {
  selectedSidebarItemIdx.value = i
}
</script>
<style scoped>
.sidebar {
  width: 56px;
  min-width: 56px;
  background-color: #363636;
  color: #fff
}

.content {
  width: calc(100% - 56px);
  background: linear-gradient(90deg, #303741, #06070c);
}

.item-icon {
  margin-right: 0;
}

.item-text {
  display: none;
}

@media screen and (min-width: 1024px) {
  .sidebar {
    width: 200px;
    min-width: 200px;
    background-color: #06070c;
    color: #fff
  }

  .item-icon {
    margin-right: 0.5em;
  }

  .item-text {
    display: initial;
  }

  .content {
    width: calc(100% - 200px);
  }
}
</style>
