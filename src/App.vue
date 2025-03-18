<script lang="ts" setup>
import { ref } from 'vue'
import PostsList from './components/PostsList.vue'
import CreatePost from './components/CreatePost.vue'

const activeKey = ref<string>()
</script>

<template>
  <div class="main">
    <a-tabs v-model:activeKey="activeKey" class="main__tabs" centered>
      <a-tab-pane class="main__post-list" key="1" tab="Список постов">
        <PostsList :is-active="activeKey === '1'" />
      </a-tab-pane>
      <a-tab-pane class="main__post-create" key="2" tab="Создать пост">
        <CreatePost :is-active="activeKey === '2'" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="scss" scoped>
.main {
  max-height: 100dvh;
  overflow: hidden;

  &__post-list {
    padding-top: 20px;
  }
}
</style>
