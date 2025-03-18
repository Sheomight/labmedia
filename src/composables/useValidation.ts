export function useValidation() {
  const required = (value: unknown) => {
    return value ? undefined : 'Поле обязательно к заполнению'
  }

  const minStringLength = (value: string) => {
    return value.length >= 6 ? undefined : 'Минимальное количество символов 6'
  }

  const hasNumber = (value: string) => {
    return /(?=.*\d)/.test(value) ? undefined : 'Поле должно содержать хотя бы одну цифру'
  }

  const hasSpecialSymbol = (value: string) => {
    return /(?=.*\W)/.test(value) ? undefined : 'Поле должно содержать спецсимвол'
  }

  const isEmail = (value: string) => {
    return /\S[^\s@]*@\S+\.\S+/.test(value) ? undefined : 'Неверный формат e-mail'
  }

  return {
    required,
    minStringLength,
    hasNumber,
    hasSpecialSymbol,
    isEmail
  }
}

export default useValidation
