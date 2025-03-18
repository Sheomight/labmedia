import { ref, computed } from "vue"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface ApiRequestOptions {
  url: string
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  query?: Record<string, string | number | boolean>
}

export function useApi<T>() {
  const data = ref<T | null>(null)
  const status = ref<number | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref(false)
  const isSuccess = computed(
    () => status.value !== null && status.value >= 200 && status.value < 300
  )
  const isError = computed(() => error.value !== null)

  const buildQueryString = (query: Record<string, string | number | boolean>): string => {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      params.append(key, String(value))
    })
    return params.toString()
  }

  const fetchData = async (options: ApiRequestOptions): Promise<void> => {
    isLoading.value = true
    error.value = null
    status.value = null

    const urlWithQuery = options.query
      ? `${options.url}?${buildQueryString(options.query)}`
      : options.url

    try {
      const response = await fetch(urlWithQuery, {
        method: options.method || "GET",
        headers: options.headers || {},
        body: options.body && options.method !== "GET" ? JSON.stringify(options.body) : null
      })

      status.value = response.status

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      data.value = (await response.json()) as T
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An unknown error occurred"
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    status,
    error,
    isLoading,
    isSuccess,
    isError,
    fetchData
  }
}
