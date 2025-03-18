<script lang="ts" setup>
import { useFormValidation, ValidationRule } from '@/composables/useFormValidation'
import { useApi } from '@/composables/useApi'
import useValidation from '@/composables/useValidation'
import { ref, watch } from 'vue'
import { notification } from 'ant-design-vue'

interface ICreatePostProps {
  isActive: boolean
}

type FormKeys = keyof typeof form.value

const form = ref({
  title: '',
  body: '',
  someField: ''
})

const props = defineProps<ICreatePostProps>()

const { required, minStringLength, hasNumber, hasSpecialSymbol, isEmail } = useValidation()

const validationRules = ref<Record<FormKeys, ValidationRule<any>[]>>({
  title: [required, minStringLength],
  body: [required],
  someField: [required]
})

const { validate, validateField, errors, hasErrors } = useFormValidation(form, validationRules)
const { fetchData, isSuccess, isLoading } = useApi()

const [api, contextHolder] = notification.useNotification()

const openNotification = () => {
  api.success({
    message: 'Пост успешно создан',
    placement: 'topRight'
  })
}

const handleClear = () => {
  form.value = {
    title: '',
    body: '',
    someField: ''
  }
  errors.value = {} as Record<FormKeys, string[]>
}

const createPost = async () => {
  await fetchData({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    body: {
      title: form.value.title,
      body: form.value.body,
      userId: 1
    }
  })
}

const handleSubmit = async () => {
  if (validate()) {
    await createPost()
    if (isSuccess.value) {
      openNotification()
    }
  }
}

const validationCheckboxes = ref({
  minStringLength: false,
  hasNumber: false,
  hasSpecialSymbol: false,
  isEmail: false
})

const updateSomeFieldValidationRules = () => {
  validationRules.value.someField = [required]
  if (validationCheckboxes.value.minStringLength) {
    validationRules.value.someField.push(minStringLength)
  }
  if (validationCheckboxes.value.hasNumber) {
    validationRules.value.someField.push(hasNumber)
  }
  if (validationCheckboxes.value.hasSpecialSymbol) {
    validationRules.value.someField.push(hasSpecialSymbol)
  }
  if (validationCheckboxes.value.isEmail) {
    validationRules.value.someField.push(isEmail)
  }
}

watch(
  () => props.isActive,
  async (newValue) => {
    if (!newValue) {
      handleClear()
    }
  }
)
</script>

<template>
  <div class="create-post">
    <form class="create-post__form" @submit.prevent>
      <div class="create-post__item">
        <a-input
          v-model:value="form.title"
          class="create-post__input"
          addonBefore="Заголовок"
          placeholder="Заголовок поста"
          :status="!!errors.title?.length ? 'error' : ''"
          @change="validateField('title', form.title)"
        />
        <small v-if="errors.title" class="create-post__error">{{ errors.title[0] }}</small>
      </div>
      <div class="create-post__item">
        <a-input
          v-model:value="form.body"
          class="create-post__input"
          addonBefore="Содержание"
          placeholder="Текст поста"
          :status="!!errors.body?.length ? 'error' : ''"
          @change="validateField('body', form.body)"
        />
        <small v-if="errors.body" class="create-post__error">{{ errors.body[0] }}</small>
      </div>
      <div class="create-post__item">
        <a-input
          v-model:value="form.someField"
          class="create-post__input"
          addonBefore="Поле"
          placeholder="Текст"
          :status="!!errors.someField?.length ? 'error' : ''"
          @change="validateField('someField', form.someField)"
        />
        <small v-if="errors.someField" class="create-post__error">{{ errors.someField[0] }}</small>
      </div>
      <div class="create-post__settings">
        <div class="create-post__settings-header">
          <h3>Настройка валидации для поля "Поле"</h3>
        </div>
        <div class="create-post__settings-options">
          <a-checkbox
            v-model:checked="validationCheckboxes.minStringLength"
            @change="updateSomeFieldValidationRules"
          >
            Минимальная длина строки
          </a-checkbox>
          <a-checkbox
            v-model:checked="validationCheckboxes.hasNumber"
            @change="updateSomeFieldValidationRules"
          >
            Содержит число
          </a-checkbox>
          <a-checkbox
            v-model:checked="validationCheckboxes.hasSpecialSymbol"
            @change="updateSomeFieldValidationRules"
          >
            Содержит спецсимвол
          </a-checkbox>
          <a-checkbox
            v-model:checked="validationCheckboxes.isEmail"
            @change="updateSomeFieldValidationRules"
          >
            Проверка на email
          </a-checkbox>
        </div>
      </div>
      <a-button type="primary" :loading="isLoading" :disabled="hasErrors" @click="handleSubmit">
        Создать пост
      </a-button>
    </form>
  </div>
  <contextHolder />
</template>

<style lang="scss" scoped>
.create-post {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &__form {
    max-width: 600px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 5px;
  }

  &__item {
    min-width: 300px;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  &__input {
    padding-bottom: 20px;
  }

  &__error {
    position: absolute;
    bottom: 0;
    left: 5px;
    color: red;
  }

  &__settings {
    width: 450px;
    border: 1px solid darkgray;
    border-radius: 10px;
    padding: 10px 20px;

    &-options {
      display: flex;
      flex-wrap: wrap;
      column-gap: 10px;
      margin-top: 10px;
    }
  }
}
</style>
