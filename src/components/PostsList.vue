<script lang="ts" setup>
import { useApi } from '@/composables/useApi'
import { notification } from 'ant-design-vue'
import { watch, defineProps, onMounted, ref } from 'vue'

interface IPostListProps {
  isActive: boolean
}

interface IPost {
  id: number
  userId: number
  title: string
  body: string
}

const props = defineProps<IPostListProps>()

const counter = ref(0)

const current = ref(1)

const { data: posts, isLoading, fetchData, error: apiError, isError } = useApi<Array<IPost>>()
const [api, contextHolder] = notification.useNotification()

const getPostList = async () => {
  counter.value++
  await fetchData({
    url: `https://jsonplaceholder.typicode.com/${counter.value <= 3 ? 'posts' : 'error'}`,
    method: 'GET',
    query: {
      _limit: 9
    }
  })
  if (isError.value) {
    api.error({
      message: apiError.value,
      placement: 'topRight'
    })
  }

  if (counter.value > 3) {
    counter.value = 0
  }
}

watch(
  () => props.isActive,
  async (newValue) => {
    if (newValue) {
      await getPostList()
      return
    }
    posts.value = null
  }
)

watch(current, async () => {
  await getPostList()
})

onMounted(async () => {
  await getPostList()
})
</script>

<template>
  <div class="post-list">
    <div class="post-list__content">
      <template v-if="!isLoading && posts?.length">
        <div class="post-list__cards">
          <a-card v-for="post in posts" :key="post.id" class="post-list__card" :title="post.title">
            <p>{{ post.body }}</p>
          </a-card>
        </div>
      </template>
      <div v-else class="post-list__placeholders">
        <a-spin v-if="isLoading" size="large" />
        <a-empty v-else />
      </div>
    </div>
  </div>
  <contextHolder />
</template>

<style lang="scss" scoped>
.post-list {
  width: 100%;
  height: 100%;

  &__content {
    padding: 0 40px;
  }

  &__cards {
    display: flex;
    flex-wrap: wrap;
    column-gap: 50px;
    row-gap: 20px;
  }

  &__card {
    max-width: 350px;
    flex-grow: 1;
  }

  &__pagination {
    margin-top: 25px;
  }

  &__placeholders {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
