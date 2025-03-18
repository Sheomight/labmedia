import { computed, Ref, ref } from 'vue'

export type ValidationRule<T> = (value: T) => string | undefined

export function useFormValidation<T extends Record<string, unknown>>(
  fields: Ref<T>,
  validationRules: Ref<Record<keyof T, ValidationRule<T[keyof T]>[]>>
) {
  const errors = ref<Record<keyof T, string[]>>({} as Record<keyof T, string[]>)

  const validateField = (fieldKey: keyof T, value: any): void => {
    if (!validationRules.value[fieldKey]) {
      return
    }

    errors.value[fieldKey as string] = []
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
      validateField(key, fields.value[key])
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

  return {
    errors,
    hasErrors,
    validate,
    validateField
  }
}
