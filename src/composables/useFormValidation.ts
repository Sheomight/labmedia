import { computed, Ref, ref } from 'vue'

type ValidationRule<T> = (value: T) => string | undefined
export type ValidationRules<T> = { [K in keyof T]: ValidationRule<T[K]>[] }

type Errors<T> = { [K in keyof T]: string[] }

export function useFormValidation<T extends Record<string, unknown>>(
  fields: Ref<T>,
  validationRules: Ref<ValidationRules<T>>
) {
  const errors = ref<Errors<T>>({} as Errors<T>)

  const validateField = <K extends keyof T>(fieldKey: K, value: T[K]): void => {
    if (!validationRules.value[fieldKey]) {
      return
    }

    errors.value[fieldKey] = []
    for (const rule of validationRules.value[fieldKey]) {
      const errorMessage = rule(value)

      if (errorMessage) {
        errors.value[fieldKey as string].push(errorMessage)
      }
    }
  }

  const validate = () => {
    let valid = true

    Object.keys(fields.value).forEach((key) => {
      const fieldKey = key as keyof T
      validateField(key, fields.value[fieldKey])
      if (errors.value[key] && errors.value[key].length) {
        valid = false
      }
    })
    return valid
  }

  const hasErrors = computed(() => {
    for (const key in errors.value) {
      if (errors.value[key].length) {
        return true
      }
    }
    return false
  })

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    errors,
    hasErrors,
    clearErrors,
    validate,
    validateField
  }
}
